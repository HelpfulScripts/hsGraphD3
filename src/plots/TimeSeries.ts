/**
 * # Time Series Plot
 * 
 * plots a 2D line with markers and smooth x-axis tranisitions.
 * 
 * ## Usage
 * `graph.series.add('timeseries', {x:<x-col>, y:<y-col>, y0?:<y-lower-fill>, r?:<size-col>});`
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
 * const graph = new hsGraphD3.GraphCartesian(root);
 * graph.series.add('timeseries', {x:'date', y:'time', y0:()=>1});
 * graph.series.add('timeseries', {x:'date', y:'volume', r:'time'});
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
 *      const graph = new hsGraphD3.GraphCartesian(svgRoot);
 *      graph.series.add('timeseries', {x:'date', y:'volume', r:'time'});
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
 *          const colors = ['#800', '#080', '#008'];
 *          defaults = log.inspect(createGraph(svgRoot[0]), null, '   ', colors)
 *              .replace(/\n/g, '<br>')
 *      }
 *   } 
 * });
 * </file>
 * </example>
 */

 /** */

import { Log }                  from 'hsutil'; const log = new Log('TimeSeries');
import { NumericDataSet, NumDomain, DataSet }       from '../Graph';
import { GraphDefaults }        from '../Graph';
import { Domains }              from '../Graph';
import { Series }               from '../Series';
import { NumericSeriesPlot }    from './NumericSeriesPlot';
import { CartSeriesDimensions } from '../CartSeriesPlot';
import { SeriesPlotDefaults }   from '../SeriesPlot';
import { d3Base, Line }               from '../Settings';
import { GraphCfg }             from '../GraphComponent'; 
import { ScalesDefaults }       from '../Scale';
 
Series.register('timeseries',   (cfg:GraphCfg, sName:string, dims:CartSeriesDimensions) => new TimeSeries(cfg, sName, dims));

export class TimeSeries extends NumericSeriesPlot {
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
        const scaleDef = this.cfg.graph.scales.defaults.dims.hor;
        scaleDef.aggregateOverTime = false;
        const defs = super.getDefaults();
        defs.line.rendered = true; 
        return defs;
    }
     
    initialize(svg:d3Base, color?:string): void {
        super.initialize(svg, color);
    } 

    preRender(data:NumericDataSet, domains:Domains): void {
        super.preRender(data, domains);
        if (typeof(this.dims.x)==='number') { log.warn(`preRender: unsupported const x=${this.dims.x} in timeseries`); }
        const x = data.colNames.indexOf(<string>this.dims.x);
        if (data.rows.length>1) { // artificially shorten the x-axis by 1 unit
            const xUnit = <number>data.rows[1][x] - <number>data.rows[0][x];
            const domain = <NumDomain>this.cfg.graph.scales.scaleDims.hor.domain();
            if (domain[1] - domain[0] > xUnit) { domain[0] += xUnit; }
            this.cfg.graph.scales.scaleDims.hor.domain(domain);         
        }   
    }

    d3RenderMarkers(svg:d3Base, data:NumericDataSet) {
        if (data.rows.length<2) { return super.d3RenderMarkers(svg, data); }
        const defaults = this.defaults;
        if (typeof(this.dims.x)==='number') { log.warn(`d3RenderMarkers: unsupported const x=${this.dims.x} in timeseries`); }
        const x = data.colNames.indexOf(<string>this.dims.x);
        if (defaults.marker.rendered) {
            const scales = this.cfg.graph.scales.scaleDims;
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

    getPathElement(svg:d3Base, cls:string):any {
        return svg.select(cls).selectAll('path');
    }

    d3RenderLine(svg:d3Base, data:DataSet) {
        const x = data.colNames.indexOf(<string>this.dims.x);
        const xUnit = <number>data.rows[1][x] - <number>data.rows[0][x];
        const scales = this.cfg.graph.scales.scaleDims;
        return super.d3RenderLine(svg, data)
            .attr('transform', `translate(${scales.hor(xUnit) - scales.hor(0)})`)
            .transition(this.cfg.transition)
            .attr('transform', `translate(0)`);
    }

    d3RenderFill(svg:d3Base, data:NumericDataSet) {
        const x = data.colNames.indexOf(<string>this.dims.x);
        const xUnit = data.rows[1][x] - data.rows[0][x];
        const scales = this.cfg.graph.scales.scaleDims;
        return super.d3RenderFill(svg, data)
            .attr('transform', `translate(${scales.hor(xUnit) - scales.hor(0)})`)
            .transition(this.cfg.transition)
            .attr('transform', `translate(0)`);
    }
} 
 
 