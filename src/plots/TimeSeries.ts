/**
 * # Time Series Plot
 * 
 * plots a 2D line with markers and smooth x-axis tranisitions .
 * 
 * ## Usage
 * `graph.addSeries('timeseries', {x:<x-col>, y:<y-col>, r?:<size-col>});`
 * 
 * 
 * ## Example
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
 * graph.addSeries('timeseries', {x:'date', y:'time', y0:1});
 * graph.addSeries('timeseries', {x:'date', y:'volume', r:'time'});
 * 
 * // adjust some settings:
 * graph.defaults.scales.dims.hor.aggregateOverTime = false;  // forget early indexes
 * graph.defaults.series.series0.marker.size = 15;
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
 */

 /** */

import { log as gLog }          from 'hsutil';   const log = gLog('TimeSeries');
import { NumericDataSet }       from '../Graph';
import { GraphDefaults }        from '../Graph';
import { Domains }              from '../Graph';
import { Series }               from '../Series';
import { NumericSeriesPlot }    from '../NumericSeriesPlot';
import { CartSeriesDimensions } from '../CartSeriesPlot';
import { SeriesPlotDefaults }   from '../SeriesPlot';
import { d3Base }               from '../Settings';
import { GraphCfg }             from '../GraphComponent'; 
 
Series.register('timeseries',   (cfg:GraphCfg, sName:string, dims:CartSeriesDimensions) => new TimeSeries(cfg, sName, dims));

export class TimeSeries extends NumericSeriesPlot {
    /**
     * plot constructor
     * @param cx string column name for x-center coordinates
     * @param cy string column name for y-center coordinates
     */
    constructor(cfg:GraphCfg, seriesName:string, dims:CartSeriesDimensions) {
        super(cfg, seriesName, dims);
        (<GraphDefaults>this.cfg.defaults.graph).easing = 'easeLinear';
    }
 
    getDefaults(): SeriesPlotDefaults {
        const def = super.getDefaults();
        def.area.rendered = true;
        return def;
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
            const domain = this.cfg.scales.hor.domain();
            if (domain[1] - domain[0] > xUnit) { domain[0] += xUnit; }
            this.cfg.scales.hor.domain(domain);         
        }   
    }

    d3RenderMarkers(svg:d3Base, data:NumericDataSet) {
        if (data.rows.length<2) { return super.d3RenderMarkers(svg, data); }
        const defaults = (<SeriesPlotDefaults>this.cfg.defaults.series[this.key]).marker;
        if (typeof(this.dims.x)==='number') { log.warn(`d3RenderMarkers: unsupported const x=${this.dims.x} in timeseries`); }
        const x = data.colNames.indexOf(<string>this.dims.x);
        if (defaults.rendered) {
            const xUnit = data.rows[1][x] - data.rows[0][x];
            const samples:any = svg.select('.markers').selectAll("circle").data(data.rows, d => d[0]);
            samples.exit().remove();            // remove unneeded circles
            samples.enter().append('circle')    // add new circles
                .call(this.d3DrawMarker, this, data.colNames)
                .attr("transform", `translate(${this.cfg.scales.hor(xUnit) - this.cfg.scales.hor(0)})`)
            .merge(samples).transition(this.cfg.transition)   // draw markers
                .call(this.d3DrawMarker, this, data.colNames)
                .attr("transform", `translate(0)`);
        }
    }

    getPathElement(svg:d3Base, cls:string):any {
        return svg.select(cls).selectAll('path');
    }

    d3RenderPath(svg:d3Base, data:NumericDataSet) {
        return super.d3RenderPath(svg, data)
            .attr('transform', `translate(${this.cfg.scales.hor(1) - this.cfg.scales.hor(0)})`)
            .transition(this.cfg.transition)
            .attr('transform', `translate(0)`);
    }

    d3RenderFill(svg:d3Base, data:NumericDataSet) {
        return super.d3RenderFill(svg, data)
            .attr('transform', `translate(${this.cfg.scales.hor(1) - this.cfg.scales.hor(0)})`)
            .transition(this.cfg.transition)
            .attr('transform', `translate(0)`);
    }
} 
 
 