/**
 * ## GraphCartesian
 * 
 * creates a 2D cartesian graph.
 * 
 * ### Example:
 * <example height=200px libs={hsGraphD3:'hsGraphD3'}>
 * <file name='script.js'>
 * // create data set:
 * const data = [   
 *  ['date', 'time', 'volume', 'costs'], 
 *  ['1/1/14', -1,   0.2, 0.3], 
 *  ['1/1/16', -0.2, 0.7, 0.2], 
 *  ['9/1/16', 0.4,  0.1, 0.3],
 *  ['5/1/17', 0.6, -0.2, 0.1], 
 *  ['7/1/18', 0.8,  0.3, 0.5], 
 *  ['1/1/19', 1,    0.2, 0.4]
 * ];
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
import { Graph }            from './Graph';
import { GraphDefaults }    from './Graph';
import { scaleDefault }     from './Scale';
import { ScalesDefaults }   from './Scale';
import { Scales }           from './Scale';
import { d3Base }           from './Settings';

type CumulateDomains = {[colName:string]: [number, number]};

export class GraphCartesian extends Graph {
    private cumulativeDomains: CumulateDomains = {};

    constructor(root:any) { 
        super(root);
        log.debug('created GraphCartesian');
    }

    /**
     * adds a series to the plot.
     * @param type type of plot to use, e.g. 'bubble' or 'scatter'
     * @param params the column name of the parameters used to plot the series
     */
    public addSeries(type:string, x:string, y:string, ...params:string[]) {
        super.addSeries(type, x, y, ...params);
        const scales = this.config.defaults.scales;
        // the first two dimensions are shared with the standard 2D dimensions 'hor' and 'ver'.
        scales.dims[x] = scales.dims[x] || scales['hor'] || scaleDefault();    // auto viewport range
        scales.dims[y] = scales.dims[y] || scales['ver'] || scaleDefault();    // auto viewport range
        params.forEach(p => scales.dims[p] = scales.dims[p] || scaleDefault());
    }

    protected makeDefaults() {
        super.makeDefaults();
        const scales = <ScalesDefaults>this.config.defaults.scales;
        scales['hor'] = scaleDefault();
        scales['ver'] = scaleDefault();
    }

    protected setScales(data:Data) {
        const scalesDefaults = <ScalesDefaults>this.config.defaults.scales;
        const margins = this.config.defaults.scales.margin;
        const scales = this.config.scales;
        this.series.expandDomain(data, this.cumulateDomains(scalesDefaults));
        scales.hor = Scales.createScale(scalesDefaults.hor, this.cumulativeDomains[0], [margins.left,  this.viewport.width-margins.right]);
        scales.ver = Scales.createScale(scalesDefaults.ver, this.cumulativeDomains[1], [this.viewport.height-margins.bottom, margins.top]);
    }

    private cumulateDomains(scalesDefaults:ScalesDefaults):CumulateDomains {
        this.cumulativeDomains[0] = this.cumulativeDomains[0] || [1e99, -1e99];
        this.cumulativeDomains[1] = this.cumulativeDomains[1] || [1e99, -1e99];
        if (!scalesDefaults.hor.aggregateOverTime) {
            this.cumulativeDomains[0][0] = 1e99;
            this.cumulativeDomains[0][1] = -1e99;
        }
        if (!scalesDefaults.ver.aggregateOverTime) {
            this.cumulativeDomains[1][0] = 1e99;
            this.cumulativeDomains[1][1] = -1e99;
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