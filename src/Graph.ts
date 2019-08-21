/**
 * # AbstractGraph
 * 
 * The base class for Graph types.
 * Takes care of the following tasks:
 * - creating a central configuratin object used through out the library.
 * - establishing {@Lifecycle lifecycle calls}:
 * 
 */

/** */

import { log as gLog }      from 'hsutil';   const log = gLog('AbstractGraph');
// import { Data, DataTable, DataSet }  from 'hsdatab';

import { select as d3Select}from 'd3';
import { transition }       from 'd3';
import * as d3              from 'd3';

import { GraphComponent}    from './GraphComponent';
import { ComponentDefaults} from './GraphComponent';
import { GraphCfg}          from './GraphComponent';
import { Series }           from './Series';
import { Scales }           from './Scale';
import { Axes }             from './Axis';
import { Grids }            from './Grid';
import { Canvas }           from './Canvas';
import { DefaultsType }     from './Settings';
import { d3Base }           from './Settings';

const vpWidth:number    = 1000;

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
    /** called the first time the `Graph` is rendered, before any of the other lifecycle methods. */
    initialize(svg:d3Base):void;

    /** Called immediately before each call to renderComponent. */
    preRender(data:DataSet): void;

    /** renders the component. */
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
    protected series:Series;

    /** the list of components to render */
    private components: GraphComponent[] = [];

    /** tracks whether components have been initialized. */
    private initialized = false;

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
     * render the tree with the supplied data.
     * @param data the data to render
     */
    public render(data:DataSet): void {
        const graph = <GraphDefaults>this.config.defaults.graph;
        const easing = d3[graph.easing];
        this.config.transition = transition().duration(graph.transitionTime);
        this.config.transition.ease(easing);
        if (!this.initialized) {
            this.initialize(this.config.baseSVG);
            this.initialized = true;
        }
        this.preRender(data);
        this.renderComponent(data);
    }

    /**
     * adds a series to the plot.
     * @param type type of plot to use, e.g. 'bubble' or 'scatter'
     * @param params the column name of the parameters used to plot the series
     */
    public addSeries(type:string, x:string, y:string, ...params:string[]) {
        //this.resize();
        this.series.addSeries(type, x, y, ...params);
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
    preRender(data:DataSet): void {
        this.setScales(data);
        this.components.forEach((comp:GraphComponent) => comp.preRender(data));
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
            this.series = new Series(cfg)
        ];
    }

    /** callback on window resize event, adjusts the viewport to the new dimensions  */
    private resize() {
        const cfg = this.config;
        // if (this.root && this.root.clientWidth > 0) {
        if (this.root) {
            if (this.root.clientWidth !== cfg.client.width || this.root.clientHeight !== cfg.client.height) {
                log.info(`resizing svg: [${cfg.client.width} x ${cfg.client.height}] -> [${this.root.clientWidth} x ${this.root.clientHeight}]`);
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
