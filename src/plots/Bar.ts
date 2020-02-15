/**
 * # Bar Plot
 * 
 * ## Usage
 * `graph.series.add('bar', {x:<x-col>, y:<y-col>, stacked?:<group-name>});`
 * 
 * ## Example
 * <example height=200px libs={hsGraphD3:'hsGraphD3'}>
 * <file name='script.js'>
 * // create data set:
 * const data = {
 *    colNames: ['State', 'volume', 'costs'], 
 *    rows:[    ['CA',     -0.1,     0.2], 
 *              ['MA',      0.2,     0.7], 
 *              ['Florida', 0.4,     0.1],
 *              ['SC',      0.6,    -0.2], 
 *              ['Nevada',  0.8,     0.3], 
 *              ['NC',      1,       0.2]]
 * };
 * 
 * // setup and plot the data:
 * const graph = new hsGraphD3.GraphCartesian(root);
 * graph.series.add('bar', {x:'costs', y:'State', label:'State'});
 * graph.series.add('bar', {x:'volume', y:'State'});
 * graph.scales.defaults.dims.ver.ordinal.gap = 0.25;
 * graph.scales.defaults.dims.ver.ordinal.overlap = 0.75;
 * graph.series.defaults[0].line.rendered = true;
 * graph.series.defaults[0].label.xpos = 'right';
 * graph.series.defaults.series1.line.rendered = true;
 * graph.grids.defaults.hor.major.rendered = false;
 * graph.render(data).update(2000, data => {
 *      data.rows.forEach(row => {
 *          row[1] = 0.5*Math.random()-0.2;
 *          row[2] = 0.5*Math.random()+0.3;
 *      });
 *      return true;
 * });
 * 
 * </file>
 * </example>
 * 
 * 
 * ## Example for stacking
 * <example height=200px libs={hsGraphD3:'hsGraphD3'}>
 * <file name='script.js'>
 * // create data set:
 * const data = {
 *    colNames: ['State', 'volume', 'costs'], 
 *    rows:[    ['CA',     -0.1,     0.2], 
 *              ['MA',      0.2,     0.7], 
 *              ['Florida', 0.4,     0.1],
 *              ['SC',      0.6,    -0.2], 
 *              ['Nevada',  0.8,     0.3], 
 *              ['NC',      1,       0.2]]
 * };
 * 
 * // setup and plot the data:
 * const graph = new hsGraphD3.GraphCartesian(root);
 * graph.series.add('bar', {x:'costs', y:'State', label:'costs', stacked:'group1'});
 * graph.series.add('bar', {x:'volume', y:'State', label:'State', stacked:'group1'});
 * graph.scales.defaults.dims.ver.ordinal.gap = 0.25;
 * graph.scales.defaults.dims.ver.ordinal.overlap = 0.75;
 * graph.series.defaults.series0.line.rendered = true;
 * graph.series.defaults[0].label.xpos = 'center';
 * graph.series.defaults.series1.line.rendered = true;
 * graph.series.defaults[1].label.xpos = 'right';
 * graph.series.defaults[1].label.inside = false;
 * graph.grids.defaults.hor.major.rendered = false;
 * graph.render(data).update(2000, data => {
 *      data.rows.forEach(row => {
 *          row[1] = 1.0*Math.random();
 *          row[2] = 1.0*Math.random();
 *      });
 *      return true;
 * });
 * 
 * </file>
 * </example>
 * 
 * 
 * ### Bar plot Default Settings:
 * <example height=600px libs={hsGraphD3:'hsGraphD3', hsUtil:'hsUtil'}>
 * <file name='script.js'>
 * const log = new hsUtil.Log('');
 * let defaults;
 * 
 * function createGraph(svgRoot) {
 *      const graph = new hsGraphD3.GraphCartesian(svgRoot);
 *      graph.series.add('bar', {y:'state', x:'volume'});
 *      return graph;
 * }
 * 
 * m.mount(root, {
 *   view:() => m('div', {style:'background-color:#eee; font-family:Monospace'}, [
 *      m('div', m.trust(defaults)), 
 *      m('div.myGraph', '')
 *   ]),
 *   oncreate: () => {
 *      const svgRoot = root.getElementsByClassName('myGraph');
 *      if (svgRoot && svgRoot.length && !defaults) { 
 *          const colors = ['#800', '#080', '#008'];
 *          const graph = createGraph(svgRoot[0]);
 *          defaults = `<b>graph.series.defaults = </b>
 *              ${log.inspect(graph.series.defaults, null, '   ', colors).replace(/\n/g, '<br>')}
 *              <br><br><b>graph.scales.defaults.dims = </b>
 *              ${log.inspect(graph.scales.defaults.dims, null, '   ', colors).replace(/\n/g, '<br>')}`;
 *      }
 *   } 
 * });
 * </file>
 * </example>
 */

 /** */

import { Log }                  from 'hsutil'; const log = new Log('Column');
import { CartSeriesDimensions } from '../CartSeriesPlot';
import { GraphCfg}              from '../GraphComponent';
import { Series }               from '../Series';
import { OrdinalSeriesPlot }    from './OrdinalSeriesPlot';
import { SeriesPlotDefaults }   from '../SeriesPlot';

Series.register('bar', (cfg:GraphCfg, sName:string, dims:CartSeriesDimensions) => new Bar(cfg, sName, dims));


export class Bar extends OrdinalSeriesPlot {
    protected abscissa:'hor'|'ver' = 'ver';

    getDefaults(): SeriesPlotDefaults {
        const gridDef = this.cfg.graph.defaults.grids.hor;
        gridDef.major.rendered = false;
        gridDef.minor.rendered = false;
        return super.getDefaults();
    } 
}
   
