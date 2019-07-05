/**
 * ## d3 Graphs
 * 
 * <example height=200px libs={hsGraphd3:'node_modules/hsgraphd3/hsGraphd3.min.js',hsDatab:'node_modules/hsdatab/hsDatab.min.js',d3:'https://d3js.org/d3.v5.min.js'}>
 * <file name='script.js'>
 * // create data set:
 * const data = new hsDatab.Data({
 *    colNames:['date', 'time', 'volume', 'costs'], 
 *    rows:[['1/1/14', -1,  0.2, 0.3], ['1/1/16', 0.2, 0.7, 0.2], ['9/1/16', 0.4, 0.1, 0.3],
 *          ['5/1/17', 0.6, 0,   0.1], ['7/1/18', 0.8, 0.3, 0.5], ['1/1/19', 1,   0.2, 0.4]]
 * });
 * 
 * // setup and plot the data:
 * const graph = new hsGraphd3.Graph(root);
 * graph.addSeries('bubble', 'time', 'volume', 'costs');
 * graph.addSeries('bubble', 'time', 'volume', 'costs');
 * 
 * //with (graph.defaults.Scales('costs').scale) {
 * //     range.min = 0
 * //     range.min = 20
 * //}
 * 
 * with (graph.defaults.Graph.canvas) {
 *      fill.color = '#eee';
 *      stroke.width = 0;
 * }
 * with (graph.defaults.Axes.hor) {
 *      tickLabel.font.size = 200;
 * }
 * with (graph.defaults.Plot.area) {
 *      //fill.color = '#fcc';
 * }
 * graph.render(data);
 * 
 * // change values avery 2s:
 * setInterval(() => {
 *    data.getData().map(row => {
 *      //row[1] = Math.random()*graph.config.viewPort.width;
 *      row[2] = Math.random()*graph.config.viewPort.height;
 *      row[3] = Math.random()*50;
 *      graph.render(data);
 *    });
 *    data.sort('ascending', 'x');
 * }, 2000);
 * 
 * 
 * </file>
 * </example>
 */

 /** */

import { log as gLog }      from 'hsutil';   const log = gLog('d3.Graph');
import * as d3              from 'd3'; 

import { Data, NumDomain }  from 'hsdatab';
import { GraphCfg, UnitVp } from './ConfigTypes';
import { d3Base }           from './ConfigTypes';
// import { Scale, scaleTypes }from './ConfigTypes';
import { Defaults }         from './Defaults';
import { Plot }             from './Plot';
import { Axis, Direction }  from './Axis';
import { GraphComponent }   from './GraphComponent';

const margin:number = 10;

log.info('Graph3D');

/**
 * creates the base SVG element for the entire graph.
 * This function is intended to be called only once at creation of the graph.
 * @param cfg 
 */
function createBaseSVG(cfg: GraphCfg):d3Base {
    const base = d3.select(cfg.root);
    base.selectAll('div').remove();
    base.selectAll('svg').remove();
    const svg = base.append('svg')
        .classed('baseSVG', true)
        .attr('height', '100%')
        .attr('width', '100%')
        .attr('preserveAspectRatio', 'xMinYMin meet')
        ;
    cfg.baseSVG = svg;
    svg.append('rect')
        .classed('baseRect', true)
        .attr('x', 0)
        .attr('y', 0);
    return svg;
}

/**
 * regualrly sets the graph's viewBox, typically after a window resize.
 * @param cfg 
 */
function updateBaseSVG(cfg: GraphCfg) {
    cfg.baseSVG.attr('viewBox', `0 0 ${cfg.viewPort.width} ${cfg.viewPort.height}`);
}


export class Graph extends GraphComponent {
    private plot:Plot;
    private axes:Axis[] = [];
    private cumulativeDomains: {[colName:string]: [number, number]} = {};

    constructor(root:any) { 
        super();
        this.config.root = root;
        log.info('creating Graph');
        const base = createBaseSVG(this.config); 
        updateBaseSVG(this.config);
        this.plot = new Plot(this.config);
        this.axes.push(new Axis(this.config, Direction.Horizontal));
        this.axes.push(new Axis(this.config, Direction.Vertical));
        window.onresize = () => this.resize();
    }

    public get defaults(): Defaults {
        return this.config.defaults;
    }

    resize() {
        const cfg = this.config;
        if (cfg.root.clientWidth > 0) {
            if (cfg.root.clientWidth !== cfg.client.width || cfg.root.clientHeight !== cfg.client.height) {
                log.info(`resizing svg: [${cfg.client.width} x ${cfg.client.height}] -> [${cfg.root.clientWidth} x ${cfg.root.clientHeight}]`);
                cfg.client.width = cfg.root.clientWidth;
                cfg.client.height = cfg.root.clientHeight;
                cfg.viewPort.height = cfg.viewPort.width * cfg.root.clientHeight / cfg.root.clientWidth;
                updateBaseSVG(cfg);
            }
        }
    }

    /**
     * renders all Graph elements using `data`
     * @param data 
     */
    public render(data:Data) {
        this.setScales(data);
        this.drawCanvas(this.config);
        this.plot.setBorders(10, 10, 10, 10);
        this.plot.render(data);
        this.axes.forEach(a => a.render(data));
    }

    /**
     * adds a series to the plot.
     * @param type type of plot to use, e.g. 'bubble' or 'scatter'
     * @param params the column name of the parameters used to plot the series
     */
    public addSeries(type:string, x:string, y:string, ...params:string[]) {
        this.resize();
        this.config.scales.hor.dataCol = x;
        this.config.scales.ver.dataCol = y;
        this.plot.addSeries(type, x, y, ...params);
    }

    /**
     * renders the Graph's background canvas
     * @param cfg 
     */
    private drawCanvas(cfg: GraphCfg) {
        const canvas = cfg.defaults.Graph.canvas;
        d3.select('.baseRect')
        .attr('width', cfg.viewPort.width)
        .attr('height', cfg.viewPort.height)
        .attr('rx', canvas.rx)
        .attr('ry', canvas.ry)
        .attr('stroke', canvas.stroke.color)
        .attr('stroke-width', canvas.stroke.width)
        .attr('stroke-opacity', canvas.stroke.opacity)
        .attr('fill', canvas.fill.color)
        .attr('fill-opacity', canvas.fill.opacity);
    }

    private setScales(data:Data) {
        /** expands `domains[colName]` to include the range of the current `data` domain. */
        function expandDomain(domains:{[colName:string]:NumDomain}, colName:string) {
            domains[colName] = domains[colName] || [1e90, -1e90];
            const dataDom:NumDomain = <NumDomain>data.findDomain(colName);
            domains[colName][0] = Math.min(domains[colName][0], dataDom[0]);
            domains[colName][1] = Math.max(domains[colName][1], dataDom[1]);
            return domains[colName];
        }
        const hor = this.config.scales.hor;
        const ver = this.config.scales.ver;
        hor.scale = d3.scaleLinear()
            .domain(expandDomain(this.cumulativeDomains, hor.dataCol))
            .range([margin, this.config.viewPort.width-2*margin]);
        ver.scale = d3.scaleLinear()
            .domain(expandDomain(this.cumulativeDomains, ver.dataCol))
            .range([this.config.viewPort.height-2*margin, margin]);
    }
}