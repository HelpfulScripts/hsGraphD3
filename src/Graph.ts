/**
 * # Graph
 * 
 * The base class for Graph types.
 * Takes care of the overall orchestration of the Graph, including the following tasks:
 * - setting up the SVG environment for the `Graph`
 * - creating a central {@link GraphComponent.GraphCfg configuration object} that is used throughout the library.
 * - creating and managing the {@link GraphComponent components} to render in ths `Graph`
 * - initializing default {@link Settings settings}
 * - establishing {@link Graph.LifecycleCalls lifecycle calls}
 * - adding {@link SeriesPlot `series`} to render by calling {@link Graph.Graph.addSeries `addSeries`}
 * - rendering the graph by calling {@link Graph.Graph.render `render`}
 * - managing a central {@link Graph.Graph.transition `transition`} that applies to all components.   
 * 
 * ### Graph Management Phases
 * Graph Management is dividied into the following phases:
 * 1. **Graph creation**: `const graph = new xxxGraph(root);`
 *     - creates the graph's {@link GraphComponent components} and their 
 *       {@link Graph.Graph.createComponents sequence of rendering} in the DOM
 *     - sets the factory {@link Settings default settings} for all components
 * 2. **Graph configuration**:
 *     - adding series: `graph.addSeries(<type>, {y:'State', x:'costs'});`
 *     - configuring defaults: e.g., `graph.defaults.grids.hor.major.rendered = false;`
 * 3. **Graph rendering**: `graph.render(<data>)`
 *     - sets the graph-wide transition timing and easing
 *     - starts a {@link Graph.LifecycleCalls render lifecycle} by calling each of the lifecycle methods on all components:
 *         - Once, following graph creation, {@Link Graph.LifecycleCalls.initialize initializes} the components
 *         - Calls {@link Graph.LifecycleCalls.preRender preRender} for any regular preparation
 *         - Calls {@link Graph.LifecycleCalls.renderComponent renderComponent} to render each component
 *     - returns a {@link Graph.RenderChain RenderChain} that can be used to dynamically {@link Graph.RenderChain.update update}
 *       the data or settings, which triggers a new render lifecycle.
 * 
 * ### Graph Default Settings:
 * <example height=300px libs={hsGraphD3:'hsGraphD3', hsUtil:'hsUtil'}>
 * <file name='script.js'>
 * const log = hsUtil.log('');
 * let defaults;
 * 
 * m.mount(root, {
 *   view:() => m('div', {style:'background-color:#eee; font-family:Monospace'}, [
 *      m('div', m.trust('graph.defaults.graph = ' + defaults)), 
 *      m('div.myGraph', '')
 *   ]),
 *   oncreate: () => {
 *      const svgRoot = root.getElementsByClassName('myGraph');
 *      if (svgRoot && svgRoot.length && !defaults) { 
 *          const colors = ['#800', '#080', '#008'];
 *          defaults = hsUtil.log
 *              .inspect(new hsGraphD3.GraphCartesian(svgRoot[0]).defaults.graph, null, '   ', colors)
 *              .replace(/\n/g, '<br>')
 *      }
 *   } 
 * });
 * </file>
 * </example>
 */

/** the modules logging setup. */
import { log as gLog }      from 'hsutil';   const log = gLog('Graph');

import { select as d3Select}from 'd3';
import * as d3              from 'd3';

import { GraphComponent}    from './GraphComponent';
import { ComponentDefaults} from './GraphComponent';
import { GraphCfg}          from './GraphComponent';
import { Series }           from './Series';
import { SeriesDimensions } from './Series';
import { Scales }           from './Scale';
import { ScalesDefaults }   from './Scale';
import { Axes }             from './Axis';
import { Grids }            from './Grid';
import { Canvas }           from './Canvas';
import { DefaultsType }     from './Settings';
import { d3Base }           from './Settings';
import { SeriesPlot }       from './SeriesPlot';

/** 
 * The standard width of the viewport, in viewport coordinates. 
 * Viewport coordinates are established via the SVG `viewBox` node, 
 * independant of the actual viewport size in pixels.
 */
const vpWidth:number = 1000;

/** 
 * Basic `ValueDef` definition: 
 * - `string`: the name of column in the data set
 * - `ValueFn`: a function, returning the value. 
 */
export type ValueDef = string|ValueFn;

/** 
 * a function returning the value of a data point 
 * @param i an optional number, typically indicating the sequence index of a row in a data set
 */
export interface ValueFn { (i?:number): DataVal; }

/** default settings for the `Graph` component */
export interface GraphDefaults extends ComponentDefaults {
    /** the duration of the `Graph`-wide transition, restarted whith each `render` call.  */
    transitionTime: number; // in ms
    easing: string;         // e.g. 'easeCubic'
}

/** Basic generic data type */
export type DataVal = number | string | Date;

export type DataRow = DataVal[];

export type NumericDataRow = number[];

export interface DataSet {
    colNames: string[];
    rows: DataRow[];
}

export interface NumericDataSet extends DataSet {
    colNames: string[];
    rows: NumericDataRow[];
}

/** 
 * translates semantic graph dimensions (e.g. 'hor', 'ver', 'size')
 * to the column names of the data used while adding a series.
 * A `ValueDef` array is used to , each element will be used in turn when `render` is called with multiple data sets.
 */
export interface GraphDimensions { [dim:string]: ValueDef[]; }

/**
 * aggregates the [min, max] ranges for each semantic {@link Graph.GraphDimensions graph dimension} (e.g. 'hor', 'ver', 'size')
 */
export interface NumDomains extends Domains { [dim:string]: NumDomain; }
export type      NumDomain = [number, number];

/**
 * aggregates the [min, max] ranges for each semantic {@link Graph.GraphDimensions graph dimension} (e.g. 'hor', 'ver', 'size')
 */
export interface TimeDomains extends Domains { [dim:string]: TimeDomain; }
export type      TimeDomain = [Date, Date];

/**
 * aggregates ordinal values for each semantic {@link Graph.GraphDimensions graph dimension} (e.g. 'hor', 'ver', 'size')
 */
export interface OrdDomains extends Domains { [dim:string]: OrdDomain; }
export type      OrdDomain = string[];

/**
 * aggregates the [min, max] ranges for each semantic {@link Graph.GraphDimensions graph dimension} (e.g. 'hor', 'ver', 'size')
 */
export interface Domains { [dim:string]:Domain; }
export type      Domain = NumDomain | OrdDomain | TimeDomain;

/**
 * Function interface, describing the signature of the call back function 
 * in {@link RenderChain `RenderChain`}.
 * If the function returns `false`, no further callbacks will be initiated
 */
export interface RenderCallback {
    (data:DataSet | DataSet[]): boolean|void;
}

/**
 * Function interface, describing the signature of the `update` function
 * @param duration optional period in ms to call `sample` function. the `Graph's` tree-wide transition
 * will be timed to end at the specified duration, upon which the `sample` callback will be called.
 * @param callback callback function that allow periodic manipulation of the `data` set. 
 * New callbacks will be scheduled at `duration` intervals as long as the callback returns `true`. 
 * Otherwise the callbacks will be stopped. Independent of the return value, 
 * a render cycle will automatically be triggered after `update` returns.
 * See {@link TimeSeries TimeSeries} for an example.
 */
export interface Update {
    (duration:number, callback:RenderCallback): void;
}

/**
 * This object is returned by a call to {@link Graph.render `Graph.render`}, providing an `update` function
 * to call in order to render dynamic data updates.
 */
export interface RenderChain {
    /** 
     * Update function, can be called to dynamically update the data and trigger a redraw in regular intervals.
     * Once called, the `callback` function will be invoked in roughly regular intervals every `duration` milliseconds.
     * Returning `false` in the `callback` will stop the callbacks.
     * @param duration optional period in ms to call `sample` function. the `Graph's` tree-wide transition
     * will be timed to end at the specified duration, upon which the `sample` callback will be called.
     * @param callback callback function that allow periodic manipulation of the `data` set. 
     * New callbacks will be scheduled at `duration` intervals as long as the callback returns `true`. 
     * Otherwise the callbacks will be stopped. Independent of the return value, 
     * a render cycle will automatically be triggered after `update` returns.
     * See {@link TimeSeries TimeSeries} for an example.
     */
    update: (duration:number, callback:RenderCallback) => void;
}

/**
 * ### Lifecycle calls
 * All `GraphComponents` implement these lifecycle methods that are called by the `Graph` instance
 * in response to a `render` call:
 * - **initialize**: called the first time the `Graph` is rendered, ahead of any other lifecycle method.
 * During initialization, the component's style settings are applied 
 * - **preRender**: called each time the `Graph` is rendered, ahead of any other recurring lifecycle method.
 * Implementations can assume that 
 *     - `initialize` has been called on all `GraphComponents`.
 *     - the main axes scales have been properly configured to the data.
 * - **renderComponent**: called each time the `Graph` is rendered, to render the component. 
 * Implementations can assume that `preRender` has been called on all `GraphComponents`.
 */
export interface LifecycleCalls {
    /** 
     * called the first time the `Graph` is rendered, before any of the other lifecycle methods. 
     * At this point, all components have been created, defaults have been defined, 
     * and the tree-wide transition has been set.
     */
    initialize(svg:d3Base):void;

    /** 
     * Called immediately before each call to renderComponent. 
     * At this point, the axis scales have been set and all components are initialized.
     */
    preRender(data:DataSet | DataSet[], domains:Domains): void;

    /** 
     * renders the component. 
     * At this point all components have completed preRendering
     */
    renderComponent(data:DataSet | DataSet[]): void;

    /** 
     * Called immediately after the call to renderComponent. 
     * Can be used for cleanup operations.
     */
    postRender(data:DataSet | DataSet[], domains:Domains): void;
}

/**
 * ## Graph
 * Abstract base Graph.
 */
export abstract class Graph implements LifecycleCalls {
    /** the HTML root element to attach the render tree to. */
    protected root:any;

    /** the `GraphCfg` object shared by all components in this graph */
    protected config: GraphCfg;

    /** the plot component, provides access to individual series components */
    protected Series:Series;

    /** the list of components to render */
    private components: GraphComponent[] = [];

    /** tracks whether components have been initialized. */
    private initialized = false;

    protected cumulativeDomains: Domains = {};

    constructor(root:any) { 
        this.root = root;
        this.config = this.initializeCfg();
        this.config.baseSVG = this.createBaseSVG(this.config); 
        this.updateBaseSVG(this.config);
        this.components = this.createComponents(this.config);
        this.makeDefaults();
        this.resize();
        window.onresize = () => this.resize();
    }

    public get defaults(): ComponentDefaults {
        return this.config.defaults;
    }

    public get viewport() {
        return this.config.viewPort;
    }

    /** returns the types of all registered `Series` */
    public get seriesTypes():string[] {
        return Series.types;
    }

    /**
     * Sets the `Graphs` transition duration as an alternative to `defaults.graph.transitionTime`.
     * If `done` is provided, it will be used as a callback for when the transition ends.
     * @param duration 
     * @param done 
     */
    public transition(duration:number, done?:(data:DataSet) =>void) {
    }

    /**
     * renders the tree with the supplied data. The call returns a {@link Graph.RenderChain `RenderChain`}
     * function that allows rendering to be repeated at fixed intervals with updated data. 
     * @param data the data to render. If `data` is a {@link Graph.DataSet DataSet}, it will be used 
     * to render all added series. Otherwise `data` can be specified as `DataSet[]` to provide a
     * different data source to each of the series. The series' index is used to index the list,
     * starting with 0 in the order of adding it to the graph. 
     * If there are more series than data sets ion the list, indexing will restart at index 0.
     * @return a `RenderChain`.
     */
    public render(data:DataSet | DataSet[]):RenderChain {
        const graphDef = <GraphDefaults>this.config.defaults.graph;
        const graph = this;

        function renderLifecycle() {
            log.debug('starting lifecycle --------------');
            if (!graph.initialized) {
                graph.initialize(graph.config.baseSVG);
                graph.initialized = true;
            }
            const scalesDefaults = <ScalesDefaults>graph.config.defaults.scales;
            graph.preRender(data, graph.prepareDomains(scalesDefaults));
            graph.renderComponent(data);
        }

        const easing = d3[graphDef.easing];
        this.config.transition = this.config.baseSVG.transition().duration(graphDef.transitionTime).ease(easing);

        renderLifecycle.bind(this)();
        
        return {
            update: (duration:number, callback:RenderCallback):void => {
                function listener() {
                    try {
                        graphDef.transitionTime = duration || graphDef.transitionTime;
                        graph.config.transition = graph.config.transition.transition().duration(graphDef.transitionTime);
                        const isRendered:boolean = (<any>d3.select('.baseSVG'))._groups[0][0]? true : false;
                        if (isRendered && callback(data) !== false) {
                            graph.config.transition.on('end', listener); 
                        }
                    }
                    catch(e) { log.warn(`error in callback: ${e}`); }
                    setTimeout(renderLifecycle.bind(graph),0);  // render on the next event loop pass, outside the transition listener.
                }
            graph.config.transition.on('end', listener); 
            }
        };
    }

    /**
     * adds a series to the plot, for example
     * ```
     * graph.addSeries('area', {x:'time', y:'costs', r:5})
     * ```
     * The object literal `dims` specifies the data to use for each 
     * semantic dimension the plot uses. For details on the dimensions 
     * see {@link Series.SeriesDimensions `SeriesDimensions`}
     * @param type type of plot to use, e.g. 'bubble' or 'scatter', See {@link Series `Series`} for available plots to use.
     * @param dims an object literal specifying the {@link Series.SeriesDimensions `SeriesDimensions`} to use. 
     */
    public addSeries(type:string, dims:SeriesDimensions):SeriesPlot {
        return this.Series.addSeries(type, dims);
    }


    //************** Lifecycle calls **************************/

    /** 
     * Called once at the beginning of the first call to `Graph.render()`
     * and initializes all known `GraphComponts`.
     */
    initialize(svg:d3Base): void {
        this.components.forEach(comp => comp.initialize(svg));
    } 

    /** Called immediately before each call to renderComponent. */
    preRender(data:DataSet | DataSet[], domains:Domains): void {
        this.Series.expandDomains(data, domains);
        this.setScales();
        // this.components.forEach((comp:GraphComponent) => comp.preRender(data, domains));
        this.components.forEach((comp:GraphComponent) => comp.preRender(data, domains));
    } 

    /** renders the component. */
    renderComponent(data:DataSet | DataSet[]): void {
        this.components.forEach((comp:GraphComponent) => comp.renderComponent(data));
    } 

    /** renders the component. */
    postRender(data:DataSet | DataSet[]): void {
        this.components.forEach((comp:GraphComponent) => comp.postRender(data));
    } 


    //************** Non-public part **************************/

    /** set the scales for the graph prior to rendering components. */
    protected abstract setScales():void;

    /** called once during construction to create the components defaults. */
    protected createDefaults():GraphDefaults {
        return {
            transitionTime: 1000,
            easing: 'easeCubic'
        };    
    }

    protected makeDefaults() {
        const defaults = this.config.defaults;
        defaults['graph'] = this.createDefaults();
        this.components.forEach(comp => defaults[comp.componentType] = comp.createDefaults());
    }

    protected abstract prepareDomains(scalesDefaults:ScalesDefaults):Domains;

    /** creates and initializes the `Graph`-wide configuration object. */
    private initializeCfg():GraphCfg {
        return {
            baseSVG:  undefined,    
            client:   { x:0, y:0, width: 0, height: 0 },
            viewPort: {
                width: vpWidth,
                height: vpWidth * 0.7   // initial height: 70% of width
            },
            defaults: <DefaultsType>{},
            scales: {},
            transition: null,
            stack: { }
        };
    }

    /** 
     * creates the list of `GraphComponents` and determines the rendering order: 
     * - Scales: not rendered explicitly, but used in other components
     * - Canvas: the background area for the plot
     * - Grids
     * - Axes
     * - Series
     */
    private createComponents(cfg:GraphCfg):GraphComponent[] {
        return [
            new Scales(cfg),
            new Canvas(cfg),
            new Grids(cfg),
            new Axes(cfg),
            this.Series = new Series(cfg)
        ];
    }

    /** callback on window resize event, adjusts the viewport to the new dimensions  */
    private resize() {
        const cfg = this.config;
        // if (this.root && this.root.clientWidth > 0) {
        if (this.root) {
            if (this.root.clientWidth !== cfg.client.width || this.root.clientHeight !== cfg.client.height) {
                log.debug(`resizing svg: [${cfg.client.width} x ${cfg.client.height}] -> [${this.root.clientWidth} x ${this.root.clientHeight}]`);
                cfg.client.width = this.root.clientWidth;
                cfg.client.height = this.root.clientHeight;
                cfg.viewPort.height = cfg.viewPort.width * this.root.clientHeight / this.root.clientWidth;
                this.updateBaseSVG(cfg);
            }
        }
    }

    /**
     * creates the base SVG element for the entire graph.
     * This function is intended to be called only once at creation of the graph.
     * @param cfg 
     */
    private createBaseSVG(cfg: GraphCfg):d3Base {
        return d3Select(this.root).append('svg')
            .classed('baseSVG', true)
            .attr('height', '100%')
            .attr('width', '100%')
            .attr('preserveAspectRatio', 'xMinYMin meet');
    }

    /**
     * sets the graph's viewBox, typically after a window resize.
     * @param cfg 
     */
    private updateBaseSVG(cfg: GraphCfg) {
        cfg.baseSVG.attr('viewBox', `0 0 ${cfg.viewPort.width} ${cfg.viewPort.height}`);
    }
}
