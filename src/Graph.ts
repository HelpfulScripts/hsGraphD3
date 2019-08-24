/**
 * # AbstractGraph
 * 
 * The base class for Graph types.
 * Takes care of the following tasks:
 * - setting up the SVG environment for the `Graph`
 * - creating the {@link GraphComponent components} to render in ths `Graph`
 * - initializing default {@link Settings settings}
 * - creating a central {@link GraphComponent.GraphCfg configuration object} that is used throughout the library.
 * - establishing {@link Graph.LifecycleCalls lifecycle calls}:
 * 
 */

/** */

import { log as gLog }      from 'hsutil';   const log = gLog('Graph');

import { select as d3Select}from 'd3';
import * as d3              from 'd3';

import { GraphComponent}    from './GraphComponent';
import { ComponentDefaults} from './GraphComponent';
import { GraphCfg}          from './GraphComponent';
import { Series }           from './Series';
import { Scales }           from './Scale';
import { ScalesDefaults }   from './Scale';
import { Axes }             from './Axis';
import { Grids }            from './Grid';
import { Canvas }           from './Canvas';
import { DefaultsType }     from './Settings';
import { d3Base }           from './Settings';

const vpWidth:number    = 1000;

export type Domains = { [dim:string]: [number, number]};

/**
 * ## Lifecycle calls
 * All `GraphComponents` implement these lifecycle methods that are called by the `Graph`:
 * - **initialize**: called the first time the `Graph` is rendered, ahead of any other lifecycle method.
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
     * At this point, all components have been created and the tree-wide transition has been set.
     */
    initialize(svg:d3Base):void;

    /** 
     * Called immediately before each call to renderComponent. 
     * At this point, the axis scales have been set and all components are initialized.
     */
    preRender(data:DataSet, domains:Domains): void;

    /** 
     * renders the component. 
     * At this point all components have completed preRendering
     */
    renderComponent(data:DataSet): void;
}


/** default settings for the `Graph` component */
export interface GraphDefaults extends ComponentDefaults {
    /** the duration of the `Graph`-wide transition, restarted whith each `render` call.  */
    transitionTime: number; // in ms
    easing: string;         // e.g. 'easeCubic'
}

export declare type DataVal = number | string | Date;
export declare type DataRow = DataVal[];
export interface DataSet {
    colNames: string[];
    rows: DataRow[];
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
    protected seriesComponent:Series;

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
    public get series():{types: string[]} {
        return {
            types: Series.types
        };
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
     * render the tree with the supplied data.
     * @param data the data to render
     * @param duration optional period in ms to call `sample` function. the `Graph's` tree-wide transition
     * will be timed to end at the specified duration, upon which the `sample` callback will be called.
     * @param update optional callback function that allow periodic manipulation of the `data` set. 
     * New callbacks will be scheduled at `duration` intervals as long as the callback returns `true`. 
     * Otherwise the callbacks will be stopped. Independent of the return value, 
     * a render cycle will automatically be triggered after `update` returns.
     * See {@link TimeSeries TimeSeries for an example.
     */
    public render(data:DataSet, duration?:number, update?:(data:DataSet) => boolean): void {
        const graph = this;
        const graphDef = <GraphDefaults>graph.config.defaults.graph;

        function listener() {
            if (update(data)) { 
                graph.config.transition = graph.config.transition.transition();
                graph.config.transition.on('end', listener); 
            }
            setTimeout(renderGraph,0);  // render on the next event loop pass, outside the transition listener.
        }
        function renderGraph() {
            if (!graph.initialized) {
                graph.initialize(graph.config.baseSVG);
                graph.initialized = true;
            }
            const scalesDefaults = <ScalesDefaults>graph.config.defaults.scales;
            graph.preRender.bind(graph)(data, graph.prepareDomains(scalesDefaults));
            graph.renderComponent.bind(graph)(data);
        }
        
        graphDef.transitionTime = duration || graphDef.transitionTime;
        const easing = d3[graphDef.easing];
        // if (!graph.config.transition) {          
            graph.config.transition = graph.config.baseSVG.transition().duration(graphDef.transitionTime).ease(easing);
            if (update) {
                graph.config.transition.on('end', update? listener : null); 
            }
        // }
        renderGraph();
    }

    /**
     * adds a series to the plot.
     * @param type type of plot to use, e.g. 'bubble' or 'scatter'
     * @param params the column name of the parameters used to plot the series
     */
    public addSeries(type:string, x:string, y:string, ...params:string[]) {
        //this.resize();
        this.seriesComponent.addSeries(type, x, y, ...params);
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
    preRender(data:DataSet, domains:Domains): void {
        this.seriesComponent.expandDomain(data, domains);
        this.setScales(data);
        this.components.forEach((comp:GraphComponent) => comp.preRender(data, domains));
    } 

    /** renders the component. */
    renderComponent(data:DataSet): void {
        this.components.forEach((comp:GraphComponent) => comp.renderComponent(data));
    } 


    //************** Non-public part **************************/

    /** set the scales for the graph prior to rendering components. */
    protected abstract setScales(data:DataSet):void;

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
            transition: null
        };
    }

    /** creates the list of `GraphComponents` and determines the rendering order. */
    private createComponents(cfg:GraphCfg):GraphComponent[] {
        return [
            new Scales(cfg),
            new Canvas(cfg),
            new Grids(cfg),
            new Axes(cfg),
            this.seriesComponent = new Series(cfg)
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
