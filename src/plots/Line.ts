/**
 * # Line Plot
 * 
 * plots a 2D line. Defers to {@link NumericSeriesPlot NumericSeriesPlot} to render plot elements and uses the 
 * default configuration to
 * - show the plot line
 * - hide the plot markers
 * - hide the plot area
 * Each of these can be modified via changing the {@link Settings default settings}.
 * 
 * ## Usage
 * `graph.addSeries('line', {x:<x-col>, y:<y-col>, y0?:<y-lower-fill>, r?:<size-col>});`
 * 
 * ## Example
 * <example height=200px libs={hsGraphD3:'hsGraphD3'}>
 * <file name='script.js'>
 * // create data set:
 * const data = {
 *    colNames:['date', 'time', 'volume', 'costs'], 
 *    rows:[['1/1/14', -1,  0.2, 0.3], ['1/1/16', 0.2, 0.7, 0.2], ['9/1/16', 0.4, 0.1, 0.3],
 *          ['5/1/17', 0.6, -0.2,   0.1], ['7/1/18', 0.8, 0.3, 0.5], ['1/1/19', 1,   0.2, 0.4]]
 * };
 * 
 * const graph = new hsGraphD3.GraphCartesian(root);
 * graph.addSeries('line', {x:'time', y:'volume', r:'costs'});
 * graph.addSeries('line', {x:'time', y:0.5});
 * graph.render(data);
 * 
 * </file>
 * </example>
 * 
 * ### Accessible format setting and defaults (for a cartesian graph):
 * <example height=600px libs={hsGraphD3:'hsGraphD3', hsUtil:'hsUtil'}>
 * <file name='script.js'>
 * const log = hsUtil.log('');
 * let defaults;
 * 
 * function createGraph(svgRoot) {
 *      const graph = new hsGraphD3.GraphCartesian(svgRoot);
 *      graph.addSeries('line', {x:'time', y:'volume', r:'costs'});
 *      graph.addSeries('line', {x:'time', y:0.5});
 *      return graph.defaults;
 * }
 * 
 * m.mount(root, {
 *   view:() => m('div', {style:'background-color:#eee; font-family:Monospace'}, [
 *      m('div', m.trust('graph.defaults = ' + defaults)), 
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

import { log as gLog }          from 'hsutil';   const log = gLog('Line');
import { NumericSeriesPlot }    from '../NumericSeriesPlot';
import { CartSeriesDimensions } from '../CartSeriesPlot';
import { SeriesPlotDefaults }   from '../SeriesPlot';
import { GraphCfg}              from '../GraphComponent';
import { Series }               from '../Series';

Series.register('line', (cfg:GraphCfg, sName:string, dims: CartSeriesDimensions) => new Line(cfg, sName, dims));

export class Line extends NumericSeriesPlot {
}

