/**
 * ## Graph2DCartesian
 * 
 * creates a 2D cartesian graph.
 * 
 * ### Example:
 * <example height=200px libs={hsGraphD3:'hsGraphD3'}>
 * <file name='script.js'>
 * // create data set:
 * const data = [['date', 'time', 'volume', 'costs'], ['1/1/14', -1,  0.2, 0.3], 
 *  ['1/1/16', 0.2, 0.7, 0.2], ['9/1/16', 0.4, 0.1, 0.3],
 *  ['5/1/17', 0.6, 0,   0.1], ['7/1/18', 0.8, 0.3, 0.5], ['1/1/19', 1,   0.2, 0.4]];
 * 
 * // setup and plot the data:
 * const graph = new hsGraphD3.Graph2DCartesian(root);
 * graph.addSeries('bubble', 'time', 'volume', 'costs');
 * 
 * with (graph.defaults.canvas) {
 *      fill.color = '#fcfcfc';
 *      stroke.width = 10;  // in viewport coordinates (0 - 1000)
 * }
 * with (graph.defaults.axes) {
 *      color = '#44c';
 *      hor.tickLabel.font.size = 20;
 * }
 * with (graph.defaults.scales.dims.costs.range) {
 *      min = 10;
 *      max = 80;
 * }
 * graph.render(data);
 * 
 * update();
 * 
 * function update() {
 *    data.map((row, i) => {
 *      if (i>0) {
 *          row[2] = Math.random()*graph.viewport.height;
 *          row[3] = Math.random()*50;
 *      }
 *    });
 *    graph.render(data);
 *    setTimeout(update, 2000);  // update values avery 2s:
 * }
 * 
 * </file>
 * </example>
 * 
 * ### Accessible format setting and defaults:
 * <example height=600px libs={hsGraphD3:'hsGraphD3', hsUtil:'hsUtil'}>
 * <file name='script.js'>
 * const log = hsUtil.log('');
 * let defaults;
 * 
 * function createGraph(svgRoot) {
 *      const graph = new hsGraphD3.Graph2DCartesian(svgRoot[0]);
 *      graph.addSeries('bubble', 'time', 'volume', 'costs');
 *      return graph.defaults;
 * }
 * 
 * m.mount(root, {
 *   view:() => m('div', {style:'background-color:#eee; font-family:Monospace'}, [
 *      m('div', {style:'font-family:monospace;'}, 'graph.defaults = '),
 *      m('div', m.trust(defaults)),   // .map(r => m('div', m.trust(r)))
 *      m('div.myGraph', '')
 *   ]),
 *   oncreate: () => {
 *      const svgRoot = root.getElementsByClassName('myGraph');
 *      if (svgRoot && svgRoot.length && !defaults) { 
 *          const colors = ['#800', '#080', '#008'];
 *          defaults = hsUtil.log.inspect(createGraph(svgRoot), null, '   ', colors)
 *              .replace(/\n/g, '<br>')
 *      }
 *   } 
 * });
 * </file>
 * </example>
 */

 /** */

import { log as gLog }      from 'hsutil';   const log = gLog('Graph2DCartesian');
import * as d3              from 'd3'; 

import { Data }             from 'hsdatab';
import { NumDomain }        from 'hsdatab';
import { AbstractGraph }    from './AbstractGraph';
import { GraphComponent }   from './GraphComponent';
import * as d               from './Defaults';
import { defaultDimScale}   from './Scale';
import { ScaleDefaults}     from './Scale';
import { Series, PlotDefaults }   from './Plot';

export class Graph2DCartesian extends AbstractGraph {
    private cumulativeDomains: {[colName:string]: [number, number]} = {};

    constructor(root:any) { 
        super(root);
        this.config.scales.hor = { dataCol: <string>undefined, scale: undefined};
        this.config.scales.ver = { dataCol: <string>undefined, scale: undefined};
        const scales = <ScaleDefaults>this.config.defaults('scales');
        const margins = scales.margin;
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
    }

    protected setScales(data:Data) {
        /** expands `domains[colName]` to include the range of the current `data` domain. */
        function expandDomain(domains:{[colName:string]:NumDomain}, colName:string) {
            domains[colName] = domains[colName] || [1e90, -1e90];
            const dataDom:NumDomain = <NumDomain>data.findDomain(colName);
            domains[colName][0] = Math.min(domains[colName][0], dataDom[0]);
            domains[colName][1] = Math.max(domains[colName][1], dataDom[1]);
            return domains[colName];
        }
        const scales = (<ScaleDefaults>this.config.defaults('scales')).dims;
        const horCol = this.config.scales.hor.dataCol;
        const verCol = this.config.scales.ver.dataCol;
        const hor = this.config.scales.hor;
        const ver = this.config.scales.ver;
        if (scales[horCol].type === 'linear') {
            hor.scale = d3.scaleLinear()
            .domain(expandDomain(this.cumulativeDomains, hor.dataCol))
            .range([scales[horCol].range.min, scales[horCol].range.max]);
        }
        if (scales[verCol].type === 'linear') {
            ver.scale = d3.scaleLinear()
            .domain(expandDomain(this.cumulativeDomains, ver.dataCol))
            .range([scales[verCol].range.min, scales[verCol].range.max]);
        }
    }
}