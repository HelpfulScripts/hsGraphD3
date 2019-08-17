/**
 * # AbstractGraph
 * 
 * The base class for Graph types.
 * Takes care of the following tasks:
 * - creating a central configuratin object used through out the library.
 * - establishing lifecycle calls:
 *      - initialize(): called during construction 
 * 
 */

/** */

import { log as gLog }      from 'hsutil';   const log = gLog('AbstractGraph');
import { Data, DataTable, DataSet }  from 'hsdatab';

import { select as d3Select}from 'd3';

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

export interface LifecycleCalls {
    /** called once during creation of the `Graph`. */
    initialize(svg:d3Base):void;

    /** Called immediately before each call to renderComponent. */
    preRender(data:Data): void;

    /** renders the component. */
    renderComponent(data:Data): void;
}

export abstract class AbstractGraph implements LifecycleCalls {
    /** the HTML root element to attach the render tree to. */
    protected root:any;

    /** the `GraphCfg` object shared by all components in this graph */
    protected config: GraphCfg;

    /** the plot component, provides access to individual series components */
    protected series:Series;

    /** the list of components to render */
    private components: GraphComponent[] = [];

    constructor(root:any) { 
        this.root = root;
        this.config = this.initializeCfg();
        this.config.baseSVG = this.createBaseSVG(this.config); 
        this.updateBaseSVG(this.config);
        this.components = this.createComponents(this.config);
        this.initialize(this.config.baseSVG);
        window.onresize = () => this.resize();
    }

    public get defaults(): ComponentDefaults {
        return this.config.defaults;
        // return this.config.defaults();
    }

    public get viewport() {
        return this.config.viewPort;
    }

    /**
     * render the tree with the supplied data.
     * @param data the data to render
     */
    public render(data:Data|DataSet|DataTable): void {
        let d:Data = (data instanceof Data)? data : new Data(data);
        this.preRender(d);
        this.renderComponent(d);
    }

    /**
     * adds a series to the plot.
     * @param type type of plot to use, e.g. 'bubble' or 'scatter'
     * @param params the column name of the parameters used to plot the series
     */
    public addSeries(type:string, x:string, y:string, ...params:string[]) {
        this.resize();
        this.series.addSeries(type, x, y, ...params);
    }


    //************** Lifecycle calls **************************/

    /** called once during creation of the `Graph`. */
    initialize(svg:d3Base): void {
        this.components.forEach(comp => {
            comp.initialize(svg);
            this.config.defaults[comp.componentType] = comp.createDefaults();
        });
    } 

    /** called once after initialization to create the components defaults. */
    createDefaults() {
    }

    /** Called immediately before each call to renderComponent. */
    preRender(data:Data): void {
        this.setScales(data);
        this.components.forEach((comp:GraphComponent) => comp.preRender(data));
    } 

    /** renders the component. */
    renderComponent(data:Data): void {
        this.components.forEach((comp:GraphComponent) => comp.renderComponent(data));
    } 


    //************** Non-public part **************************/

    /** set the scales for the graph prior to rendering components. */
    protected abstract setScales(data:Data):void;

    private initializeCfg():GraphCfg {
        return {
            baseSVG:  undefined,    
            client:   { x:0, y:0, width: 0, height: 0 },
            viewPort: {
                width: vpWidth,
                height: vpWidth * 0.7   // initial height: 70% of width
            },
            defaults: <DefaultsType>{},
            scales: {} 
        };
    }

    private createComponents(cfg:GraphCfg):GraphComponent[] {
        return [
            new Scales(cfg),
            new Canvas(cfg),
            new Grids(cfg),
            this.series = new Series(cfg),
            new Axes(cfg)
        ];
    }

    /** callback on window resize event;  */
    private resize() {
        const cfg = this.config;
        if (this.root && this.root.clientWidth > 0) {
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
     * regualrly sets the graph's viewBox, typically after a window resize.
     * @param cfg 
     */
    private updateBaseSVG(cfg: GraphCfg) {
        cfg.baseSVG.attr('viewBox', `0 0 ${cfg.viewPort.width} ${cfg.viewPort.height}`);
    }
}
