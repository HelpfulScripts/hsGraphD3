/**
 * # Time Series Plot
 * 
 * plots a 2D line with markers and smooth x-axis tranisitions .
 * 
 * ## Usage
 * Invoke a `timeseries` by adding a new series to the graph
 * `graph.addSeries('timeseries', <x-col>, <y-col>, [<size-col>]);`
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
 * graph.addSeries('timeseries', 'date', 'time');
 * graph.addSeries('timeseries', 'date', 'volume', 'time');
 * 
 * // adjust some settings:
 * graph.defaults.scales.dims.hor.aggregateOverTime = false;  // forget early indexes
 * graph.defaults.series.series0.line.color = '#00a';  // first line blue
 * graph.defaults.series.series1.line.color = '#0a0';  // second line green
 * graph.defaults.series.series0.marker.size = 1.5;
 * 
 * // trigger the update loop to plot the data
 * graph.render(data, 1000, (data) => {
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
import { DataSet }              from '../Graph';
import { GraphDefaults }        from '../Graph';
import { Domains }              from '../Graph';
import { Series }               from '../Series';
import { SeriesPlot }           from '../SeriesPlot';
import { SeriesPlotDefaults }   from '../SeriesPlot';
import { d3Base }               from '../Settings';
import { GraphCfg }             from '../GraphComponent'; 
 

class TimeSeries extends SeriesPlot {
    /**
     * plot constructor
     * @param cx string column name for x-center coordinates
     * @param cy string column name for y-center coordinates
     */
    constructor(cfg:GraphCfg, seriesName:string, protected cx:string, protected cy:string, protected r:string) {
        super(cfg, seriesName, cx, cy, r);
        (<GraphDefaults>this.cfg.defaults.graph).easing = 'easeLinear';
    }
 
    getDefaults(): SeriesPlotDefaults {
        const def = super.getDefaults();
        return def;
    }
     
    initialize(svg:d3Base): void {
        super.initialize(svg);
    } 

    preRender(data:DataSet, domains:Domains): void {
        super.preRender(data, domains);
        if (data.rows.length>1) { // artificially shorten the x-axis by 1 unit
            const xUnit = <number>data.rows[1][this.cols[0]] - <number>data.rows[0][this.cols[0]];
            const domain = this.cfg.scales.hor.domain();
            if (domain[1] - domain[0] > xUnit) { domain[0] += xUnit; }
            this.cfg.scales.hor.domain(domain);         
        }   
    }

    d3RenderMarkers(svg:d3Base, data:DataSet) {
        if (data.rows.length<2) { return super.d3RenderMarkers(svg, data); }
        const xUnit = <number>data.rows[1][this.cols[0]] - <number>data.rows[0][this.cols[0]];
        const samples:any = svg.select('.markers').selectAll("circle").data(data.rows, d => d[0]);
        samples.exit().remove();            // remove unneeded circles
        samples.enter().append('circle')    // add new circles
            .call(this.d3DrawMarker, this)
            .attr("transform", `translate(${this.cfg.scales.hor(xUnit) - this.cfg.scales.hor(0)})`)
        .merge(samples).transition(this.cfg.transition)   // draw markers
            .call(this.d3DrawMarker, this)
            .attr("transform", `translate(0)`);
    }

    d3RenderPath(svg:d3Base, data:DataSet) {
        if (data.rows.length<2) { return super.d3RenderPath(svg, data); }

        const path = this.svg.select('.lines').selectAll('path'); //.data([<number[][]>data.rows]);
        path.attr('d', d => this.lines(<number[][]>data.rows))
            .attr("transform", `translate(${this.cfg.scales.hor(1) - this.cfg.scales.hor(0)})`)
         .transition(this.cfg.transition)
            .attr("transform", `translate(0)`)
        ;
    }
} 
 
Series.register('timeseries', (cfg:GraphCfg, sName:string, cx:string, cy:string, r:string) => new TimeSeries(cfg, sName, cx, cy, r));
 