/**
 * ## GraphCartesian
 * 
 * creates a 2D cartesian graph.
 * 
 * ### Example:
 * <example height=200px libs={hsGraphD3:'hsGraphD3'}>
 * <file name='script.js'>
 * // create data set:
 * const data = {
 *      colNames: ['date', 'time', 'volume', 'costs'], 
 *      rows: [
 *          ['1/1/14', -1,   0.2, 0.3], 
 *          ['1/1/16', -0.2, 0.7, 0.2], 
 *          ['9/1/16', 0.4,  0.1, 0.3],
 *          ['5/1/17', 0.6, -0.2, 0.1], 
 *          ['7/1/18', 0.8,  0.3, 0.5], 
 *          ['1/1/19', 1,    0.2, 0.4]
 *      ]
 * }  
 * 
 * // setup and plot the data:
 * const graph = new hsGraphD3.GraphCartesian(root);
 * graph.addSeries('line', {x:'time', y:'volume'},);
 * graph.addSeries('line', {x:'time', y:'costs'});
 * 
 * with (graph.defaults.canvas) {
 *      fill.color = '#fcfcfc';
 *      stroke.width = 10;  // in viewport coordinates (0 - 1000)
 * }
 * 
 * // series defaults can be indexed by position or by name. Names are created as `series`+position index.
 * graph.defaults.series[0].marker.size = 15;
 * graph.defaults.series[0].marker.fill.color = '#66f';
 * graph.defaults.series[0].marker.stroke.color = '#00f';
 * graph.defaults.series.series0.line.width = 5;
 * graph.defaults.series.series0.line.color = '#00c';
 * 
 * graph.defaults.series.series1.marker.size = 10;
 * graph.defaults.series.series1.marker.fill.color = '#6f6';
 * graph.defaults.series.series1.marker.stroke.color = '#0a0';
 * graph.defaults.series.series1.line.width = 5;
 * graph.defaults.series[1].line.color = '#0c0';
 * 
 * graph.render(data).update(2000, data => {
 *    data.rows.map(row => {
 *      row[2] = 2*(Math.random()-0.5); // -1...1
 *      row[3] = Math.random();         //  0...1
 *    });
 *    return true;
 * });
 * 
 * </file>
 * </example>
 * 
 */

 /** */

import { log as gLog } from 'hsutil';   const log = gLog('GraphCartesian');

import { DataSet }              from './Graph';
import { ValueDef }            from './Graph';
import { GraphDimensions }      from './Graph';
import { Graph }                from './Graph';
import { Domains }              from './Graph';
import { scaleDefault }         from './Scale';
import { ScalesDefaults }       from './Scale';
import { Scales }               from './Scale';
import { d3Base }               from './Settings';
import { SeriesPlot }           from './SeriesPlot';
import { CartSeriesDimensions } from './CartSeriesPlot';
import "./plots/Bubble";
import "./plots/Line";
import "./plots/Area";
import "./plots/TimeSeries";
import "./plots/Voronoi";
import "./plots/Column";
import "./plots/Bar";


export interface CartDimensions extends GraphDimensions { hor:ValueDef[]; ver:ValueDef[]; size:ValueDef[]; }

export class GraphCartesian extends Graph {
    /**
     * adds a series to the plot.
     * At a minimum, an x- and y coordinate column name needs to be specified to use on the data.
     * Accordingly, scales will be defined for each of the coordinate indexes.
     * 
     * @param type type of plot to use, e.g. 'bubble' or 'scatter'
     * @param dims mapping of data column names to the series dimensions used to plot the series
     */
    public addSeries(type:string, dims:CartSeriesDimensions):SeriesPlot {
        const series = super.addSeries(type, dims);
        const scalesDefaults = <ScalesDefaults>this.config.defaults.scales;
        scalesDefaults.dims['hor']  = scalesDefaults.dims['hor']  || scaleDefault();    // auto viewport range
        scalesDefaults.dims['ver']  = scalesDefaults.dims['ver']  || scaleDefault();    // auto viewport range
        scalesDefaults.dims['size'] = scalesDefaults.dims['size'] || scaleDefault(5, 20);  
        return series;
    }

    /**
     * set scales, called during `prerender`
     * @param data 
     */
    protected setScales() {
        const scalesDefaults = <ScalesDefaults>this.config.defaults.scales;
        const margins = this.config.defaults.scales.margin;
        const scales = this.config.scales;
        scales.hor  = Scales.createScale(scalesDefaults.dims.hor, this.cumulativeDomains.hor, [margins.left,  this.viewport.width-margins.right]);
        scales.ver  = Scales.createScale(scalesDefaults.dims.ver, this.cumulativeDomains.ver, [this.viewport.height-margins.bottom, margins.top]);
        scales.size = Scales.createScale(scalesDefaults.dims.size, this.cumulativeDomains.size);
    }

    /**
     * returns a `Domains` object 
     * @param scalesDefaults 
     */
    protected prepareDomains(scalesDefaults:ScalesDefaults):Domains {
        const dom = this.cumulativeDomains;
        const dims = scalesDefaults.dims;
        dom.hor  = (dom.hor  && dims.hor.aggregateOverTime)?  dom.hor  : undefined;
        dom.ver  = (dom.ver  && dims.ver.aggregateOverTime)?  dom.ver  : undefined;
        dom.size = (dom.size && dims.size.aggregateOverTime)? dom.size : undefined;
        return dom;
    }


    //************** Lifecycle calls **************************/
    initialize(svg:d3Base): void {
        super.initialize(svg);
        this.config.scales.hor = undefined;
        this.config.scales.ver = undefined;
    }
}