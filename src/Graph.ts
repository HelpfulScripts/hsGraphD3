/**
 * ## d3 Graphs
 * 
 * <example height=200px libs={hsGraphD3:'hsGraphD3',d3:'d3'}>
 * <file name='script.js'>
 * // create data set:
 * const data = [['date', 'time', 'volume', 'costs'], ['1/1/14', -1,  0.2, 0.3], 
 *  ['1/1/16', 0.2, 0.7, 0.2], ['9/1/16', 0.4, 0.1, 0.3],
 *  ['5/1/17', 0.6, 0,   0.1], ['7/1/18', 0.8, 0.3, 0.5], ['1/1/19', 1,   0.2, 0.4]];
 * 
 * // setup and plot the data:
 * const graph = new hsGraphD3.Graph(root);
 * graph.addSeries('bubble', 'time', 'volume', 'costs');
 * graph.addSeries('bubble', 'time', 'volume', 'costs');
 * 
 * with (graph.defaults.graph.canvas) {
 *      fill.color = '#fcfcfc';
 *      stroke.width = 0;
 * }
 * with (graph.defaults.axes.hor) {
 *      tickLabel.font.size = 10;
 * }
 * with (graph.defaults.scales.costs.range) {
 *      min = 10;
 *      max = 80;
 * }
 * graph.render(data);
 * 
 * // change values avery 2s:
 * setInterval(update, 2000);
 * 
 * function update() {
 *    data.map((row, i) => {
 *      if (i>0) {
 *          row[2] = Math.random()*graph.config.viewPort.height;
 *          row[3] = Math.random()*50;
 *      }
 *    });
 *    graph.render(data);
 * }
 * 
 * </file>
 * </example>
 */

 /** */

import { log as gLog }      from 'hsutil';   const log = gLog('Graph');
import * as d3              from 'd3'; 

import { Data, NumDomain }  from 'hsdatab';
import { DataTable }        from 'hsdatab';
import { DataSet }          from 'hsdatab';
import { GraphCfg }         from './ConfigTypes';
import { d3Base }           from './ConfigTypes';
import { Defaults }         from './Defaults';
import { Plot }             from './Plot';
import { Axis, Direction }  from './Axis';
import { Grid, MajorMinor } from './Grid';
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
    svg.append('rect').classed('graphArea', true).attr('x', 0).attr('y', 0);
    svg.append('g').classed('grid', true);
    svg.append('g').classed('axes', true);
    svg.append('g').classed('series', true);
    svg.append('rect').classed('graphBorder', true).attr('x', 0).attr('y', 0);
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
    private grids:Grid[] = [];
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
        this.grids.push(new Grid(this.config, Direction.Horizontal, MajorMinor.major));
        this.grids.push(new Grid(this.config, Direction.Horizontal, MajorMinor.minor));
        this.grids.push(new Grid(this.config, Direction.Vertical, MajorMinor.major));
        this.grids.push(new Grid(this.config, Direction.Vertical, MajorMinor.minor));
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
    public render(data:Data|DataSet|DataTable) {
        log.debug(log.inspect(this.defaults, 10));        
        let d:Data = (data instanceof Data)? data : new Data(data);
        this.setScales(d);
        this.drawCanvas(this.config);
        this.grids.forEach(a => a.render());
        this.plot.render(d);
        this.axes.forEach(a => a.render());
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

    /**
     * renders the Graph's background canvas
     * @param cfg 
     */
    private drawCanvas(cfg: GraphCfg) {
        const canvas = cfg.defaults.graph.canvas;
        d3.select('.graphArea')
        .attr('width', cfg.viewPort.width)
        .attr('height', cfg.viewPort.height)
        .attr('rx', canvas.rx)
        .attr('ry', canvas.ry)
        .attr('fill', canvas.fill.color)
        .attr('fill-opacity', canvas.fill.opacity);
        d3.select('.graphBorder')
        .attr('width', cfg.viewPort.width)
        .attr('height', cfg.viewPort.height)
        .attr('rx', canvas.rx)
        .attr('ry', canvas.ry)
        .attr('stroke', canvas.stroke.color)
        .attr('stroke-width', canvas.stroke.width)
        .attr('stroke-opacity', canvas.stroke.opacity)
        .attr('fill-opacity', 0);
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
        const cfg = this.defaults.scales;
        const horCol = this.config.scales.hor.dataCol;
        const verCol = this.config.scales.ver.dataCol;
        const hor = this.config.scales.hor;
        const ver = this.config.scales.ver;
        if (cfg[horCol].type === 'linear') {
            hor.scale = d3.scaleLinear()
            .domain(expandDomain(this.cumulativeDomains, hor.dataCol))
            .range([cfg[horCol].range.min, cfg[horCol].range.max]);
        }
        if (cfg[verCol].type === 'linear') {
            ver.scale = d3.scaleLinear()
            .domain(expandDomain(this.cumulativeDomains, ver.dataCol))
            .range([cfg[verCol].range.min, cfg[verCol].range.max]);
        }
    }
}