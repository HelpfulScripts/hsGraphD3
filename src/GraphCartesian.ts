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
 * graph.addSeries('line', 'time', 'volume',);
 * graph.addSeries('line', 'time', 'costs');
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
 * graph.render(data, 2000, update);
 * 
 * function update() {
 *    data.rows.map(row => {
 *      row[2] = 2*(Math.random()-0.5); // -1...1
 *      row[3] = Math.random();         //  0...1
 *    });
 *    return true;
 * }
 * 
 * </file>
 * </example>
 * 
 */

 /** */

import { log as gLog }      from 'hsutil';   const log = gLog('GraphCartesian');

import { DataSet }          from './Graph';
import { Graph }            from './Graph';
import { Domains }          from './Graph';
import { scaleDefault }     from './Scale';
import { ScalesDefaults }   from './Scale';
import { Scales }           from './Scale';
import { d3Base }           from './Settings';


export class GraphCartesian extends Graph {
    constructor(root:any) { 
        super(root);
        log.debug('created GraphCartesian');
    }

    /**
     * adds a series to the plot.
     * At a minimum, an x- and y coordinate column name needs to be specified to use on the data.
     * Additional column names will interpreted as follows:
     * - index 0: x coordinate
     * - index 1: y coordinate
     * - index 2: size of marker (replaces default setting)
     * 
     * Accordingly, scales will be defined for each of the coordinate indexes.
     * 
     * @param type type of plot to use, e.g. 'bubble' or 'scatter'
     * @param params the column name of the parameters used to plot the series
     */
    public addSeries(type:string, x:string, y:string, ...params:string[]) {
        super.addSeries(type, x, y, ...params);
        const scales = this.config.defaults.scales;
        // the first two dimensions are shared with the standard 2D dimensions 'hor' and 'ver'.
        scales.dims[0] = scales.dims[0] || scales.dims['hor'] || scaleDefault();       // auto viewport range
        scales.dims[1] = scales.dims[1] || scales.dims['ver'] || scaleDefault();       // auto viewport range
        if (params.length > 0) { 
            scales.dims[2] = scales.dims[2] || scales.dims['size'] || scaleDefault();  // auto viewport range
        }
    }

    protected makeDefaults() {
        super.makeDefaults();
        const scales = <ScalesDefaults>this.config.defaults.scales.dims;
        scales.hor  = scaleDefault();
        scales.ver  = scaleDefault();
        scales.size = scaleDefault(5, 15); // marker sizes in vpUnits
    }

    protected setScales(data:DataSet) {
        const scalesDefaults = <ScalesDefaults>this.config.defaults.scales;
        const margins = this.config.defaults.scales.margin;
        const scales = this.config.scales;
        scales.hor  = Scales.createScale(scalesDefaults.dims.hor, this.cumulativeDomains[0], [margins.left,  this.viewport.width-margins.right]);
        scales.ver  = Scales.createScale(scalesDefaults.dims.ver, this.cumulativeDomains[1], [this.viewport.height-margins.bottom, margins.top]);
        scales.size = Scales.createScale(scalesDefaults.dims.size, this.cumulativeDomains[2]);
    }

    protected prepareDomains(scalesDefaults:ScalesDefaults):Domains {
        if (!this.cumulativeDomains[0] || !scalesDefaults.dims.hor.aggregateOverTime)  { 
            this.cumulativeDomains[0] = this.cumulativeDomains.hor = [1e99, -1e99]; 
        }
        if (!this.cumulativeDomains[1] || !scalesDefaults.dims.ver.aggregateOverTime)  { 
            this.cumulativeDomains[1] = this.cumulativeDomains.ver = [1e99, -1e99]; 
        }
        if (!this.cumulativeDomains[2] || !scalesDefaults.dims.size.aggregateOverTime) { 
            this.cumulativeDomains[2] = this.cumulativeDomains.size = [1e99, -1e99]; 
        }
        return this.cumulativeDomains;
    }


    //************** Lifecycle calls **************************/
    initialize(svg:d3Base): void {
        super.initialize(svg);
        this.config.scales.hor = undefined;
        this.config.scales.ver = undefined;
    }
}