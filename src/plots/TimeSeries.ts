/**
 * # Time Series Plot
 * 
 * plots a 2D line with markers and smooth x-axis tranisitions.
 * 
 * ## Usage
 * `graph.add('timeseries', {x:<x-col>, y:<y-col>, y0?:<y-lower-fill>, r?:<size-col>});`
 * 
 * 
 * ## Example
 * - top row: plot and update a random time series with area fill against '1'
 * - bottom row: plot and update a random time series as a line with markers of random size
 * <example height=200px libs={hsGraphD3:'hsGraphD3'}>
 * <file name='script.js'>
 * // create data set:
 * let index = 0;
 * const data = {
 *    colNames:['date', 'time', 'volume'], 
 *    rows:[], 
 * };
 * while (index<11) { data.rows.push([index++, Math.random()+1, Math.random()])}
 * 
 * // create the graph and define the series to plot:
 * const graph = new hsGraphD3.Graph(root);
 * graph.add('timeseries', {x:'date', y:'time', y0:()=>1});
 * graph.add('timeseries', {x:'date', y:'volume', r:'time'});
 * 
 * // adjust some settings:
 * graph.series.defaults.series0.marker.size = 15;
 * 
 * // trigger the update loop to plot the data
 * graph.render(data).update(1000, data => {
 *      // add new sample
 *      data.rows.push([index++, Math.random()+1, Math.random()]);
 *      // remove old sample
 *      if (data.rows.length > 10) { data.rows.shift(); }
 *      return true;
 * });
 * </file>
 * </example>
 * 
 * ### TimeSeries plot Default Settings:
 * <example height=600px libs={hsGraphD3:'hsGraphD3', hsUtil:'hsUtil'}>
 * <file name='script.js'>
 * const log = new hsUtil.Log('');
 * let defaults;
 * 
 * function createGraph(svgRoot) {
 *      const graph = new hsGraphD3.Graph(svgRoot);
 *      graph.add('timeseries', {x:'date', y:'volume', r:'time'});
 *      return graph.series.defaults[0];
 * }
 * 
 * m.mount(root, {
 *   view:() => m('div', {style:'background-color:#eee; font-family:Monospace'}, [
 *      m('div', m.trust('graph.series.defaults[0] = ' + defaults)), 
 *      m('div.myGraph', '')
 *   ]),
 *   oncreate: () => {
 *      const svgRoot = root.getElementsByClassName('myGraph');
 *      if (svgRoot && svgRoot.length && !defaults) { 
 *          // const colors = ['#800', '#080', '#008'];
 *          defaults = log.inspect(createGraph(svgRoot[0]), {})
 *              .replace(/\n/g, '<br>')
 *      }
 *   } 
 * });
 * </file>
 * </example>
 */

 /** */

import { Log }                  from 'hsutil'; const log = new Log('TimeSeries');
import { Transition, BaseType}  from 'd3';
import { NumericDataSet }       from '../Graph';
import { NumDomain }            from '../Graph';
import { DataSet }              from '../Graph';
import { Series }               from '../Series';
import { SeriesPlotNumeric }    from '../SeriesPlotNumeric';
import { CartSeriesDimensions } from '../SeriesPlotCartesian';
import { SeriesPlotDefaults }   from '../SeriesPlot';
import { d3Transition }         from '../SeriesPlot';
import { d3Base }               from '../Settings';
import { GraphCfg }             from '../GraphComponent'; 
 
Series.register('timeseries',   (cfg:GraphCfg, sName:string, dims:CartSeriesDimensions) => new TimeSeries(cfg, sName, dims));

export class TimeSeries extends SeriesPlotNumeric {
    /**
     * plot constructor
     * @param cx string column name for x-center coordinates
     * @param cy string column name for y-center coordinates
     */
    constructor(cfg:GraphCfg, seriesName:string, dims:CartSeriesDimensions) {
        super(cfg, seriesName, dims);
        this.cfg.graph.defaults.graph.transition.easing = 'easeLinear';
    }
 
    getDefaults(): SeriesPlotDefaults {
        const scaleDef = this.cfg.components.scales.defaults.dims.hor;
        scaleDef.aggregateOverTime = false;
        const defs = super.getDefaults();
        defs.line.rendered = true; 
        return defs;
    }
     
    initialize(svg:d3Base, color?:string): void {
        super.initialize(svg, color);
    } 

    preRender(data:NumericDataSet): void {
        super.preRender(data);
        if (typeof(this.dims.x)==='number') { log.warn(`preRender: unsupported const x=${this.dims.x} in timeseries`); }
        const x = data.colNames.indexOf(<string>this.dims.x);
        if (data.rows.length>1) { // artificially shorten the x-axis by 1 unit
            const xUnit = <number>data.rows[1][x] - <number>data.rows[0][x];
            const domain = <NumDomain>this.cfg.components.scales.scaleDims.hor.domain();
            if (domain[1] - domain[0] > xUnit) { domain[0] += xUnit; }
            this.cfg.components.scales.scaleDims.hor.domain(domain);         
        }   
    }

    d3RenderMarkers(svg:d3Base, data:NumericDataSet) {
        if (data.rows.length<2) { return super.d3RenderMarkers(svg, data); }
        const defaults = this.defaults;
        if (typeof(this.dims.x)==='number') { log.warn(`d3RenderMarkers: unsupported const x=${this.dims.x} in timeseries`); }
        const x = data.colNames.indexOf(<string>this.dims.x);
        if (defaults.marker.rendered) {
            const scales = this.cfg.components.scales.scaleDims;
            const xUnit = data.rows[1][x] - data.rows[0][x];
            const samples:any = svg.select('.markers').selectAll("circle").data(data.rows, d => d[0]);
            samples.exit().remove();            // remove unneeded circles
            samples.enter().append('circle')    // add new circles
                .call(this.d3DrawMarker.bind(this), data, defaults)
                .attr("transform", `translate(${scales.hor(xUnit) - scales.hor(0)})`)
            .merge(samples).transition(this.cfg.transition)   // draw markers
                .call(this.d3DrawMarker.bind(this), data, defaults)
                .attr("transform", `translate(0)`);
        }
    }

    d3RenderLine(svg:d3Base, data:DataSet):d3Transition {
        const x = data.colNames.indexOf(<string>this.dims.x);
        const xUnit = <number>data.rows[1][x] - <number>data.rows[0][x];
        const scales = this.cfg.components.scales.scaleDims;
        this.line = this.line || this.getPath(data.rows, data.colNames, this.dims.y);
        return svg.select('.line').selectAll('path')
            .attr('d', (d:any) => this.line)
            .attr('transform', `translate(${scales.hor(xUnit) - scales.hor(0)})`)
            .transition(this.cfg.transition)
            .attr('transform', `translate(0)`);
    }

    d3RenderFill(svg:d3Base, data:NumericDataSet):d3Transition {
        const x = data.colNames.indexOf(<string>this.dims.x);
        const xUnit = data.rows[1][x] - data.rows[0][x];
        const scales = this.cfg.components.scales.scaleDims;
        let line = this.line = this.line || this.getPath(data.rows, data.colNames, this.dims.y);
        if (this.dims.y0!==undefined) {
            line += `L` + this.getPath(data.rows.reverse(), data.colNames, this.dims.y0, false).slice(1); // replace first 'M' with 'L'
        }
        return svg.select('.area').selectAll('path')
            .attr('d', (d:any) => line)
            .attr('transform', `translate(${scales.hor(xUnit) - scales.hor(0)})`)
            .transition(this.cfg.transition)
            .attr('transform', `translate(0)`);
    }
} 
 
 