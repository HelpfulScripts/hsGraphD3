/**
 * # Bar Plot
 * 
 * ## Usage
 * `graph.addSeries('bar', {x:<x-col>, y:<y-col>, stacked?:<group-name>});`
 * 
 * ## Example
 * <example height=200px libs={hsGraphD3:'hsGraphD3'}>
 * <file name='script.js'>
 * // create data set:
 * const data = {
 *    colNames: ['State', 'volume', 'costs'], 
 *    rows:[    ['CA',     -0.1,     0.2], 
 *              ['MA',      0.2,     0.7], 
 *              ['FL',      0.4,     0.1],
 *              ['SC',      0.6,    -0.2], 
 *              ['NV',      0.8,     0.3], 
 *              ['NC',      1,       0.2]]
 * };
 * 
 * // setup and plot the data:
 * const graph = new hsGraphD3.GraphCartesian(root);
 * graph.addSeries('bar', {x:'costs', y:'State'});
 * graph.addSeries('bar', {x:'volume', y:'State'});
 * graph.defaults.series.ordinal.gap = 0.25;
 * graph.defaults.series.ordinal.overlap = 0.75;
 * graph.defaults.series[0].line.rendered = true;
 * graph.defaults.series[1].line.rendered = true;
 * graph.defaults.grids.hor.major.rendered = false;
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
 *              ['FL',      0.4,     0.1],
 *              ['SC',      0.6,    -0.2], 
 *              ['NV',      0.8,     0.3], 
 *              ['NC',      1,       0.2]]
 * };
 * 
 * // setup and plot the data:
 * const graph = new hsGraphD3.GraphCartesian(root);
 * graph.addSeries('bar', {x:'costs', y:'State', stacked:'group1'});
 * graph.addSeries('bar', {x:'volume', y:'State', stacked:'group1'});
 * graph.defaults.series.ordinal.gap = 0.25;
 * graph.defaults.series.ordinal.overlap = 0.75;
 * graph.defaults.series[0].line.rendered = true;
 * graph.defaults.series[1].line.rendered = true;
 * graph.defaults.grids.hor.major.rendered = false;
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
 * const log = hsUtil.log('');
 * let defaults;
 * 
 * function createGraph(svgRoot) {
 *      const graph = new hsGraphD3.GraphCartesian(svgRoot);
 *      graph.addSeries('bar', {y:'state', x:'volume'});
 *      return graph.defaults.series;
 * }
 * 
 * m.mount(root, {
 *   view:() => m('div', {style:'background-color:#eee; font-family:Monospace'}, [
 *      m('div', m.trust('graph.defaults.series[0] = ' + defaults)), 
 *      m('div.myGraph', '')
 *   ]),
 *   oncreate: () => {
 *      const svgRoot = root.getElementsByClassName('myGraph');
 *      if (svgRoot && svgRoot.length && !defaults) { 
 *          const colors = ['#800', '#080', '#008'];
 *          defaults = hsUtil.log.inspect(createGraph(svgRoot[0]), null, '   ', colors)
 *              .replace(/\n/g, '<br>')
 *      }
 *   } 
 * });
 * </file>
 * </example>
 */

 /** */

import { log as gLog }          from 'hsutil';   const log = gLog('Column');
import { CartSeriesDimensions } from '../CartSeriesPlot';
import { GraphCfg}              from '../GraphComponent';
import { Series }               from '../Series';
import { OrdinalSeriesPlot }    from './OrdinalSeriesPlot';

Series.register('bar', (cfg:GraphCfg, sName:string, dims:CartSeriesDimensions) => new Bar(cfg, sName, dims));


export class Bar extends OrdinalSeriesPlot {
    protected get independentAxis():'ver' { return 'ver'; }
} 
   