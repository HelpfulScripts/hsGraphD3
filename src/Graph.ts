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
 * - adding {@link SeriesPlot `series`} to render by calling {@link Graph.Graph.add `add`}
 * - rendering the graph by calling {@link Graph.Graph.render `render`}
 * - managing a central {@link Graph.Graph.transition `transition`} that applies to all components.   
 * 
 * ### Graph Management Phases
 * Graph Management is dividied into the following phases:
 * 1. **Graph creation**: <br>
 * `const graph = new xxxGraph(root);`
 *     - creates the graph's {@link GraphComponent components} and their 
 *       {@link Graph.Graph.createComponents sequence of rendering} in the DOM
 *     - sets the factory {@link Settings default settings} for all components
 * 2. **Graph configuration**:
 *     - adding series: <br>
 *      `graph.add(<type>, {y:'State', x:'costs'});`
 *     - configuring defaults: e.g., <br>
 *      `graph.grids.defaults.hor.major.rendered = false;`
 * 3. **Graph rendering**: <br>
 * `graph.render(<data>)`
 *     - sets the graph-wide transition timing and easing
 *     - starts a {@link Graph.LifecycleCalls render lifecycle} by calling each of the lifecycle methods on all components:
 *         - Once, following graph creation:
 *             - {@link Graph.LifecycleCalls.initialize initializes} the components
 *         - for each pass through the lifecycle:
 *             - Calls {@link Graph.LifecycleCalls.preRender preRender} for any regular preparation:
 *                 - calls {@link Graph.Graph.setScales setScales} to initialize scaling
 *                 - calls {@link Graph.LifecycleCalls.preRender preRender} on all components in the sequence they were {@link Graph.Graph.createComponents created}
 *             - Calls {@link Graph.LifecycleCalls.renderComponent renderComponent} to render each component
 *     - returns a {@link Graph.RenderChain RenderChain} that can be used to dynamically {@link Graph.RenderChain.update update}
 *       the data or settings, which triggers a new render lifecycle.
 * 
 * ### Graph Default Settings:
 * <example height=300px libs={hsGraphD3:'hsGraphD3', hsUtil:'hsUtil'}>
 * <file name='script.js'>
 * const log = new hsUtil.Log('');
 * let defaults;
 * 
 * m.mount(root, {
 *   view:() => m('div', {style:'background-color:#eee; font-family:Monospace'}, [
 *      m('div', m.trust('graph.graph.defaults = ' + defaults)), 
 *      m('div.myGraph', '')
 *   ]),
 *   oncreate: () => {
 *      const svgRoot = root.getElementsByClassName('myGraph');
 *      if (svgRoot && svgRoot.length && !defaults) { 
 *          const colors = ['#800', '#080', '#008'];
 *          defaults = log
 *              .inspect(new hsGraphD3.Graph(svgRoot[0]).defaults.graph)
 *              .replace(/\n/g, '<br>')
 *      }
 *   } 
 * });
 * </file>
 * </example>
 * 
 * ### Mithril Integration:
 * <example height=300px libs={hsGraphD3:'hsGraphD3', hsUtil:'hsUtil'}>
 * <file name='script.js'>
 * const data = {
 *    colNames:['date', 'time', 'volume', 'costs'], 
 *    rows:[   ['1/1/14', -1,     0.2,    0.3], 
 *             ['1/1/16',  0.2,   0.7,    0.2], 
 *             ['9/1/16',  0.4,   0.1,    0.3],
 *             ['5/1/17',  0.6,  -0.2,    0.1], 
 *             ['7/1/18',  0.8,   0.3,    0.5], 
 *             ['1/1/19',  1,     0.2,    0.4]]
 * };
 * 
 * m.mount(root, {
 *   view:() => m('#graph1', m(hsGraphD3.Graph, {
 *      rootID: 'graph1',
 *      define: (graph) => {
 *          graph.add('line', {x:'time', y:'volume'});
 *          graph.add('line', {x:'time', y:'costs'});
 *          graph.title.text = `simple 'line' graph`;
 *      },
 *      data: data
 *      //updatePeriod: number, 
 *      //updateCallback:RenderCallback;
 *   }))
 * });
 * </file>
 * </example>
 */

/** the modules logging setup. */
import { Log }                  from 'hsutil'; const log = new Log('Graph');

import { select as d3Select}    from 'd3';
import { easeLinear}            from 'd3';
import { easeCubic}             from 'd3';

import { GraphBase}             from './GraphComponent';
import { GraphComponent}        from './GraphComponent';
import { Components }           from './GraphComponent';
import { ComponentDefaults}     from './GraphComponent';
import { GraphCfg}              from './GraphComponent';
import { Series }               from './Series';
import { SeriesDefaults }       from './Series';
import { Scales }               from './Scales';
import { ScalesDefaults }       from './Scales';
import { Axes }                 from './Axis';
import { AxesDefaults }         from './Axis';
import { Grids }                from './Grid';
import { GridsDefaults }        from './Grid';
import { Canvas }               from './Canvas';
import { CanvasDefaults }       from './Canvas';
import { d3Base, Index }        from './Settings';
import { Popup }                from './Popup';
import { PopupDefaults }        from './Popup';
import { Title }                from './Title';
import { TitleDefaults }        from './Title';
import { ValueDef }             from "./SeriesPlot";
import { SeriesDimensions }     from "./SeriesPlot";

const easings = {
    easeLinear: easeLinear,
    easeCubic:  easeCubic,
    easeNone: ()=>1
};
/** 
 * The standard width of the viewport, in viewport coordinates. 
 * Viewport coordinates are established via the SVG `viewBox` node, 
 * independant of the actual viewport size in pixels.
 */
const vpWidth:number = 1000;


/** default settings for the `Graph` component */
export interface GraphDefaults extends ComponentDefaults {
    graph:  GraphComponentDefaults;
    scales: ScalesDefaults;
    canvas: CanvasDefaults;
    grids:  GridsDefaults;
    axes:   AxesDefaults;
    series: SeriesDefaults;
    title:  TitleDefaults;
    popup:  PopupDefaults;
}

/** default settings for the `Graph` component */
export interface GraphComponentDefaults extends ComponentDefaults {
    transition : {
        /** the duration of the `Graph`-wide transition, restarted whith each `render` call.  */
        duration:   number; // in ms

        /** the easing function used for trsansitions */
        easing:     'easeCubic' | 'easeLinear' | 'easeNone'; 
    };
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
export interface Domains { [dim:string]:Domain; }
export type      Domain = NumDomain | OrdDomain | TimeDomain;

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
 * Function interface, describing the signature of the call back function 
 * in {@link Graph.RenderChain `RenderChain`}.
 * If the function returns `false`, no further callbacks will be initiated
 */
export interface RenderCallback {
    (data:DataSet | DataSet[]): boolean|void;
}

export interface AccessFn {
    (dataRow:DataVal[], rowIndex:Index): DataVal;
}


/**
 * Function interface, describing the signature of the `update` function.
 * See {@link plots.TimeSeries TimeSeries} for an example.
 */
export interface Update {
    /**
     * function definition:
     * @param duration optional period in ms to call `sample` function. the `Graph's` tree-wide transition
     * will be timed to end at the specified duration, upon which the `sample` callback will be called.
     * @param callback callback function that allow periodic manipulation of the `data` set. 
     * New callbacks will be scheduled at `duration` intervals as long as the callback returns `true`. 
     * Otherwise the callbacks will be stopped. Independent of the return value, 
     * a render cycle will automatically be triggered after `update` returns.
     */
    (duration:number, callback:RenderCallback): void;
}

/**
 * This object is returned by a call to {@link Graph.Graph.render `Graph.render`}, providing an `update` function
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
     * See {@link plots.TimeSeries TimeSeries} for an example.
     */
    update: Update;
}

/**
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
 * - **postRender**: called each time the `Graph` is rendered, to render the component. 
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
    preRender(data:DataSet | DataSet[]): void;

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


// export interface Vnode {
//     dom: HTMLElement;
//     attrs: {
//         define: (graph:Graph)=>void;
//         data: DataSet;
//         updatePeriod: number;
//         updateCallback: RenderCallback;
//     };
// }

interface Lifecycle<Attrs, State> {
    oninit?(this: State, vnode: Vnode<Attrs, State>): any;
    oncreate?(this: State, vnode: Vnode<Attrs, State>): any;
    onbeforeremove?(this: State, vnode: Vnode<Attrs, State>): Promise<any> | void;
    onremove?(this: State, vnode: Vnode<Attrs, State>): any;
    onbeforeupdate?(this: State, vnode: Vnode<Attrs, State>, old: Vnode<Attrs, State>): boolean | void;
    onupdate?(this: State, vnode: Vnode<Attrs, State>): any;
    [_: number]: any;
}

interface Vnode<Attrs = {}, State extends Lifecycle<Attrs, State> = {}> {
    dom: HTMLElement;
    tag: string;
    attrs: {
        define: (graph:Graph)=>void;
        data: DataSet;
        updatePeriod: number;
        updateCallback: RenderCallback;
    };
    state: State;
    key?: string | number;
    children?: any;
    text?: string | number | boolean;
}



/** creates and initializes the `Graph`-wide configuration object. */
function initializeCfg():GraphCfg {
    return {
        baseSVG:  undefined,  
        graph: undefined,
        components: <Components><unknown>[],
        client:   { x:0, y:0, width: 0, height: 0 },
        viewPort: {
            orgX: 0,
            orgY: 0,
            width: vpWidth,
            height: vpWidth * 0.7   // initial height: 70% of width
        },
        // defaults: <DefaultsType>{},
        transition: null,
        stack: { }
    };
}

/**
 * ### Graph
 * Abstract base Graph.
 */
export class Graph extends GraphBase {
    //------------ static parts  -------------------
    static type = 'graph';

    private static graphs = {};
    private static addGraph(id:string, fn:()=>void) { 
        log.debug(`addGraph ${id}`);
        Graph.graphs[id] = fn; 
    }
    private static removeGraph(id:string) { 
        log.debug(`removeGraph ${id}`);
        delete Graph.graphs[id]; 
    }
    private static resizeGraphs() {
        Object.keys(Graph.graphs).forEach(g => Graph.graphs[g]());
    }
    

    //------------ instance variables  -------------------
    /** the HTML root element to attach the render tree to. */
    protected root:any;


    /** tracks whether components have been initialized. */
    private initialized = false;

    /** Default settings for GraphComponents in this graph */
    graphDefaults = <GraphDefaults>{};

    
    //------------ public methods  -------------------
    /**
     * `D3` constructor, call
     * ```
     * const graph = new Graph(svgBase);
     * graph.add(...);
     * graph.grids.defaults....;
     * graph.render(data)
     * ```
     * @param root the HTML element to which to attach the graph.
     */
    constructor(root:HTMLElement);
    /**
     * `Mithril` constructor. To use `Graph` with MithrilJS, call
     * ```
     * m(Graph, {
     *    rootID: string, the ID (without the #) of the root element to which the graph will be attached. 
     *    define: (graph:Graph) => {
     *       graph.add(...);`
     *       graph.grids.defaults....;`
     *    },
     *    data: DataSet | DataSet[],
     *    updatePeriod: number, 
     *    updateCallback:RenderCallback;
     * })
     * ```
     * @param root the Vnode as implicitely called by `Mithril`
     */
    constructor(root:Vnode);
    /**
     * Overload constructor
     * @param root the HTML element or Vnode to which to attach the graph.
     */
    constructor(root:HTMLElement|Vnode) {
        super(initializeCfg());
        this.cfg.graph = this;
        if (root['attrs'] && root['attrs'].rootID) {
            const rootID = root['attrs'].rootID;
            root = document.getElementById(rootID);
            if (!root) { log.warn(`did not find element with ID ${rootID}`); }
        }
        if (root && (<HTMLElement>root).baseURI) { this.create(<HTMLElement>root); }
    }

    public create(root:HTMLElement) {
        this.root = root;
        if (this.root) {
            this.cfg.baseSVG = this.createBaseSVG(this.cfg); 
            this.updateBaseSVG(this.cfg);
            this.createComponents(this.cfg);
            this.makeDefaults();
            this.resize();
            window.onresize = Graph.resizeGraphs;
        }
    }

    public get componentType() { return Graph.type; }

    public get defaults(): GraphDefaults { return this.graphDefaults; }

    /** returns the types of all registered `Series` */
    public get seriesTypes():string[] {
        return Series.types;
    }

    public add(type:string, dims:SeriesDimensions) {
        this.cfg.components.series.add(type, dims);
    }

    /**
     * Sets the `Graphs` transition duration as an alternative to `defaults.graph.transitionTime`.
     * If `done` is provided, it will be used as a callback for when the transition ends.
     * @param duration 
     * @param done 
     */
    public transition(duration:number, done?:(data:DataSet) =>void) {
    }

    public isRendered() {
        const base = (<any>d3Select(this.root).select('.baseSVG'));
        return base.node().clientWidth? true : false;
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
        const transitionDef = this.defaults.graph.transition;
        const graph = this;

        const easing = easings[transitionDef.easing || 'easeNone'];
        this.cfg.transition = this.cfg.baseSVG.transition().duration(transitionDef.duration).ease(easing);

        Graph.addGraph(graph.root.id, () => {   // called upon resize
            setTimeout(() => {
                graph.resize();
                graph.renderLifecycle(data);
            }, 0);
        });
        graph.renderLifecycle(data);
        
        return { update: graph.updateFn(data)};
    }

    /** called once during construction to create the components defaults. */
    public createDefaults():GraphComponentDefaults {
        return {
            transition: {
                duration: 1000,
                easing: 'easeCubic'
            }
        };
    }


    //************** Components calls **************************/
    get scales():Scales { return this.cfg.components.scales; }
    get canvas():Canvas { return this.cfg.components.canvas; }
    get grids():Grids   { return this.cfg.components.grids; }
    get axes():Axes     { return this.cfg.components.axes; }
    get series():Series { return this.cfg.components.series; }
    get title():Title   { return this.cfg.components.title; }
    get popup():Popup   { return this.cfg.components.popup; }

    /**
     * Mithril integration method. See the {@link Graph.Graph.constructor `Graph` constructor}
     * for usage pattern.
     */
    public oninit(node:Vnode) {
        if (this.cfg.components.series) { node.attrs.define(this); }
    }

    public view(node:Vnode) {
        if (this.root) {
            const chain = this.render(node.attrs.data);
            if (node.attrs.updatePeriod) { 
                chain.update(node.attrs.updatePeriod, node.attrs.updateCallback); 
            }
        }
    }


    //************** Lifecycle calls **************************/

    /** 
     * Called once at the beginning of the first call to `Graph.render()`
     * and initializes all known `GraphComponts`.
     */
    initialize(svg:d3Base): void {
        const comps = (<GraphComponent[]><unknown>this.cfg.components);
        comps.forEach(comp => comp?comp.initialize(svg):'');
    } 

    /** Called immediately before each call to renderComponent. */
    preRender(data:DataSet | DataSet[]): void {
        const comps = (<GraphComponent[]><unknown>this.cfg.components);
        comps.forEach(comp => comp?comp.preRender(data):'');
    } 

    /** renders the component. */
    renderComponent(data:DataSet | DataSet[]): void {
        const comps = (<GraphComponent[]><unknown>this.cfg.components);
        comps.forEach(comp => comp?comp.renderComponent(data):'');
    } 

    /** renders the component. */
    postRender(data:DataSet | DataSet[]): void {
        const comps = (<GraphComponent[]><unknown>this.cfg.components);
        comps.forEach(comp => comp?comp.postRender(data):'');
    } 

    renderLifecycle(data:DataSet | DataSet[]) {
        const isRendered = this.isRendered();
        if (isRendered) {
            if (!this.initialized) {
                this.initialize(this.cfg.baseSVG);
                this.initialized = true;
            }
            // const scalesDefaults = <ScalesDefaults>this.defaults['scales'];
            this.preRender(data);
            this.renderComponent(data);
            this.postRender(data);
        } else {
            Graph.removeGraph(this.root.id);
        }
    }

    //************** Non-public part **************************/

    protected get viewport() {
        return this.cfg.viewPort;
    }

    private updateFn(data:DataSet | DataSet[]) {
        const graphDef = this.defaults.graph;
        const graph = this;
        return (duration:number, callback?:RenderCallback):void => {
            function listener() {
                try {
                    graphDef.transition.duration = duration || graphDef.transition.duration;
                    graph.cfg.transition = graph.cfg.transition.transition().duration(graphDef.transition.duration);
                    
                    // set new transition if a) still rendered, b) callback is missing, or c) callback returns undefined or truthy
                    if (graph.isRendered() && (!callback || callback(data) !== false)) {
                        graph.cfg.transition.on('end', listener); 
                    }
                }
                catch(e) { log.warn(`error in callback: ${e}`); }
                setTimeout(() => graph.renderLifecycle(data),0);  // render on the next event loop pass, outside the transition listener.
            }
            graph.cfg.transition.on('end', listener); 
        };
    }

    /** set the scales for the graph prior to rendering components. */
    // protected abstract setScales():void;

    protected makeDefaults() {
        this.graphDefaults = <GraphDefaults>{};
        this.graphDefaults[this.componentType] = this.createDefaults();
        Object.keys(this.cfg.components).forEach(comp => this.graphDefaults[comp] = this.cfg.components[comp]?this.cfg.components[comp].createDefaults(): {});
    }

    // protected abstract prepareDomains(scalesDefaults:ScalesDefaults):Domains;

    /** 
     * creates the list of `GraphComponents` and determines the rendering order: 
     * - Scales: not rendered explicitly, but used in other components
     * - Canvas: the background area for the plot
     * - Grids
     * - Axes
     * - Title
     * - Series
     * - Popup
     */
    protected createComponents(cfg:GraphCfg) {
        const comps = (<GraphComponent[]><unknown>this.cfg.components);
        comps.push(this.cfg.components.scales  = new Scales(cfg));
        comps.push(this.cfg.components.canvas  = new Canvas(cfg));
        comps.push(this.cfg.components.grids   = new Grids(cfg));
        comps.push(this.cfg.components.axes    = new Axes(cfg));
        comps.push(this.cfg.components.title   = new Title(cfg));
        comps.push(this.cfg.components.series  = new Series(cfg));
        comps.push(this.cfg.components.popup   = new Popup(cfg));
    }

    /** callback on window resize event, adjusts the viewport to the new dimensions  */
    private resize() {
        const client = this.cfg.client;
        const vp = this.cfg.viewPort;
        // if (this.root && this.root.clientWidth > 0) {
        if (this.root) {
            if (this.root.clientWidth !== client.width || this.root.clientHeight !== client.height) {
                log.debug(()=>`resizing svg for ${this.root.id}: [${client.width} x ${client.height}] -> [${this.root.clientWidth} x ${this.root.clientHeight}]`);
                client.width = this.root.clientWidth;
                client.height = this.root.clientHeight;
                vp.width = 2*this.root.clientWidth;
                vp.height = vp.width * this.root.clientHeight / this.root.clientWidth;
                this.updateBaseSVG(this.cfg);
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
    protected updateBaseSVG(cfg: GraphCfg) {
        cfg.baseSVG.attr('viewBox', `0 0 ${cfg.viewPort.width} ${cfg.viewPort.height}`);
    }
}

