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
 * const data = {
 *    colNames:['date', 'time', 'volume'], 
 *    rows:[], 
 * };
 * for (let i=0; i<11; i++) { data.rows.push([i, Math.random(), Math.random()+1])}
 * 
 * // create the graph and define the series to plot:
 * const graph = new hsGraphD3.GraphCartesian(root);
 * graph.addSeries('timeseries', 'date', 'time');
 * graph.addSeries('timeseries', 'date', 'volume');
 * 
 * // adjust some settings:
 * graph.defaults.scales.hor.aggregateOverTime = false;  // forget early indexes
 * graph.defaults.series.series0.line.color = '#00a';  // first line blue
 * graph.defaults.series.series1.line.color = '#0a0';  // first line blue
 * 
 * // trigger the update loop to plot the data
 * let index = 11;
 * update();
 * 
 * function update() {
 *      index++;
 *      // modify the data in this round:
 *      data.rows.push([index, Math.random(), Math.random()+1]);
 * 
 *      // render the graph: 
 *      graph.render(data);
 *      if (data.rows.length > 10) { data.rows.shift(); }
 * 
 *      // trigger next update in 1.5s:
 *      setTimeout(update, 1050);
 * }
 * </file>
 * </example>
 */

 /** */

import { log as gLog }          from 'hsutil';   const log = gLog('Bubble');
import { DataSet, GraphDefaults }              from '../Graph';
import { SeriesPlot }           from '../SeriesPlot';
import { SeriesPlotDefaults }   from '../SeriesPlot';
import { Series }               from '../Series';
import { d3Base }               from '../Settings';
import { GraphCfg }             from '../GraphComponent'; 
 

class TimeSeries extends SeriesPlot {
     /**
      * plot constructor
      * @param cx string column name for x-center coordinates
      * @param cy string column name for y-center coordinates
      */
     constructor(cfg:GraphCfg, seriesName:string, protected cx:string, protected cy:string) {
         super(cfg, seriesName, cx, cy);
         (<GraphDefaults>this.cfg.defaults.graph).easing = 'easeLinear';
     }
 
     getDefaults(): SeriesPlotDefaults {
         const def = super.getDefaults();
         return def;
     }
     
     initialize(svg:d3Base): void {
         super.initialize(svg);
     } 
  
     d3RenderMarkers(svg:d3Base, data:DataSet) {
        const defaults = this.cfg.defaults.series[this.key].marker;
        const rScale = this.cfg.scales[this.dims[2]];

        const samples:any = svg.select('.markers').selectAll("circle").data(data.rows, d => d[0]);
        samples.exit().remove();            // remove unneeded circles
        samples.enter().append('circle')    // add new circles
            .call(this.d3DrawMarker, this)
            .attr("transform", `translate(${this.cfg.scales.hor(1) - this.cfg.scales.hor(0)})`)
        .merge(samples).transition(this.cfg.transition)   // draw markers
            .call(this.d3DrawMarker, this)
            .attr("transform", `translate(0)`);
    }

    d3RenderPath(svg:d3Base, data:DataSet) {
        const path = this.svg.select('.lines').selectAll('path'); //.data([<number[][]>data.rows]);
        path.attr('d', d => this.lines(<number[][]>data.rows))
            .attr("transform", `translate(${this.cfg.scales.hor(1) - this.cfg.scales.hor(0)})`)
         .transition(this.cfg.transition)
            .attr("transform", `translate(0)`)
        ;
    }
 } 
 
 Series.register('timeseries', (cfg:GraphCfg, sName:string, cx:string, cy:string) => new TimeSeries(cfg, sName, cx, cy));
 