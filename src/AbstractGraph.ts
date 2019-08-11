/**
 * 
 */

/** */

import { log as gLog }      from 'hsutil';   const log = gLog('AbstractGraph');
import { Data, DataTable, DataSet }  from 'hsdatab';

import * as d3              from 'd3';
import * as d               from './Defaults';

import { d3Base }           from './ConfigTypes';
import { GraphComponent}    from './GraphComponent';
import { ComponentDefaults} from './GraphComponent';
import { GraphCfg}          from './GraphComponent';
import { Series }             from './Plot';
import { Scales }           from './Scale';
import { Axes }             from './Axis';
import { Grids }            from './Grid';
import { Canvas }           from './Canvas';

const vpWidth:number    = 1000;


export abstract class AbstractGraph {
    /** the HTML root element to attach the render tree to. */
    protected root:any;

    /** the `GraphCfg` object shared by all components in this graph */
    protected config: GraphCfg;

    /** the plot component, provides access to individual series components */
    protected plot:Series;

    /** the list of components to render */
    private components: GraphComponent[] = [];


    constructor(root:any) { 
        this.root = root;
        this.config = this.initializeCfg();
        this.config.baseSVG = this.createBaseSVG(this.config); 
        this.updateBaseSVG(this.config);
        this.components = this.createComponents();
        window.onresize = () => this.resize();
    }

    public get defaults(): ComponentDefaults {
        return this.config.defaults();
    }

    public get viewport() {
        return this.config.viewPort;
    }

    /**
     * render the tree with the supplied data.
     * @param data 
     */
    public render(data:Data|DataSet|DataTable): void {
        let d:Data = (data instanceof Data)? data : new Data(data);
        this.setScales(d);
        this.components.forEach((comp:GraphComponent) => comp.renderComponent(d));
    }

    /**
     * adds a series to the plot.
     * @param type type of plot to use, e.g. 'bubble' or 'scatter'
     * @param params the column name of the parameters used to plot the series
     */
    public addSeries(type:string, x:string, y:string, ...params:string[]) {
        this.resize();
        this.plot.addSeries(type, x, y, ...params);
    }


    //************** Non-public part **************************/

    /** set the scales for the graph prior to rendering components. */
    protected abstract setScales(data:Data):void;

    private initializeCfg():GraphCfg {
        const defaults = new d.Defaults();
        return {
            baseSVG:  undefined,    
            client:   { x:0, y:0, width: 0, height: 0 },
            viewPort: {
                width: vpWidth,
                height: vpWidth * 0.7   // initial height: 70% of width
            },
            defaults: defaults.getDefaults.bind(defaults),
            scales: {} 
        };
    }

    private createComponents():GraphComponent[] {
        return [
            new Scales(),
            new Canvas(this.config),
            new Grids(this.config),
            this.plot = new Series(this.config),
            new Axes(this.config)
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
        const svg = d3.select(this.root).append('svg')
            .classed('baseSVG', true)
            .attr('height', '100%')
            .attr('width', '100%')
            .attr('preserveAspectRatio', 'xMinYMin meet')
            ;
        // determine order of rendering:
        svg.append('rect').classed('graphArea', true).attr('x', 0).attr('y', 0);
        svg.append('g').classed('grids', true);
        svg.append('g').classed('axes', true);
        svg.append('g').classed('series', true);
        svg.append('rect').classed('graphBorder', true).attr('x', 0).attr('y', 0);
        return svg;
    }

    /**
     * regualrly sets the graph's viewBox, typically after a window resize.
     * @param cfg 
     */
    private updateBaseSVG(cfg: GraphCfg) {
        cfg.baseSVG.attr('viewBox', `0 0 ${cfg.viewPort.width} ${cfg.viewPort.height}`);
    }
}
