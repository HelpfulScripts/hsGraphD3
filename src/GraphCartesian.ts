/**
 * ## GraphCartesian
 * 
 * creates a 2D cartesian graph.
 * 
 * ### Example:
 * <example height=200px libs={hsGraphD3:'hsGraphD3'}>
 * <file name='script.js'>
 * // create data set:
 * const data = [['date', 'time', 'volume', 'costs'], ['1/1/14', -1,  0.2, 0.3], 
 *  ['1/1/16', 0.2, 0.7, 0.2], ['9/1/16', 0.4, 0.1, 0.3],
 *  ['5/1/17', 0.6, -0.2,   0.1], ['7/1/18', 0.8, 0.3, 0.5], ['1/1/19', 1,   0.2, 0.4]];
 * 
 * // setup and plot the data:
 * const graph = new hsGraphD3.GraphCartesian(root);
 * graph.addSeries('bubble', 'time', 'volume');
 * graph.addSeries('bubble', 'time', 'costs');
 * 
 * with (graph.defaults.canvas) {
 *      fill.color = '#fcfcfc';
 *      stroke.width = 10;  // in viewport coordinates (0 - 1000)
 * }
 * with (graph.defaults.axes) {
 *      color = '#44c';
 *      hor.tickLabel.font.size = 20;
 * }
 * 
 * graph.defaults.series[0].marker.size = 100;
 * graph.defaults.series.series1.marker.size = 50;
 * 
 * console.log(graph.defaults.series);
 * graph.render(data);
 * 
 * update();
 * 
 * function update() {
 *    data.map((row, i) => {
 *      if (i>0) {
 *          row[2] = Math.random()*graph.viewport.height;
 *          row[3] = Math.random()*graph.viewport.height;
 *      }
 *    });
 *    graph.render(data);
 *    setTimeout(update, 2000);  // update values avery 2s:
 * }
 * 
 * </file>
 * </example>
 * 
 */

 /** */

import { log as gLog }      from 'hsutil';   const log = gLog('GraphCartesian');

import { Data }             from 'hsdatab';
import { AbstractGraph }    from './AbstractGraph';
import { defaultDimScale }  from './Scale';
import { ScaleDefaults }    from './Scale';
import { Scales }           from './Scale';

export class GraphCartesian extends AbstractGraph {
    private cumulativeDomains: {[colName:string]: [number, number]} = {};

    constructor(root:any) { 
        super(root);
        const scales = <ScaleDefaults>this.config.defaults.scales;
        const margins = scales.margin;
        this.config.scales.hor = undefined;
        this.config.scales.ver = undefined;
        scales.dims['hor'] = defaultDimScale(margins.left, this.viewport.width-margins.right);
        scales.dims['ver'] = defaultDimScale(margins.top, this.viewport.height-margins.bottom);
        log.info('creating Graph');
    }

    /**
     * adds a series to the plot.
     * @param type type of plot to use, e.g. 'bubble' or 'scatter'
     * @param params the column name of the parameters used to plot the series
     */
    public addSeries(type:string, x:string, y:string, ...params:string[]) {
        super.addSeries(type, x, y, ...params);
        const scales = this.config.defaults.scales.dims;
        // the first two dimensions are shared with the standard 2D dimensions 'hor' and 'ver'.
        scales[params[0]] = scales[params[0]] || scales['hor'] || defaultDimScale(0, 1);
        scales[params[1]] = scales[params[1]] || scales['ver'] || defaultDimScale(0, 1);
    }

    protected setScales(data:Data) {
        const aggregateOverTime = false;
        const scalesDefaults = this.config.defaults.scales.dims;
        const scales = this.config.scales;
        if (!aggregateOverTime) {
            this.cumulativeDomains = {};
        } 
        this.cumulativeDomains[0] = this.cumulativeDomains[0] || [1e99, -1e99];
        this.cumulativeDomains[1] = this.cumulativeDomains[1] || [1e99, -1e99];
        const domain = this.series.expandDomain(data, this.cumulativeDomains);
// log.info(`setScales ${log.inspect(this.cumulativeDomains,null)}`);
        scales.hor = Scales.createScale(scalesDefaults.hor, this.cumulativeDomains[0], [0, this.viewport.width]);
        scales.ver = Scales.createScale(scalesDefaults.ver, this.cumulativeDomains[1], [0, this.viewport.height]);
    }
}