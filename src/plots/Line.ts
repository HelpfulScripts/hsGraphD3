/**
 * # Line Plot
 * 
 * plots a 2D line with markers.
 * 
 * ## Usage
 * `graph.addSeries('line', <x-col>, <y-col>, [<size-col>]);`
 * Invoke a `line` series by adding a new series to the graph
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
 * graph.addSeries('line', 'time', 'volume');
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
 *      graph.addSeries('bubble', 'time', 'volume', 'costs');
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

import { log as gLog }          from 'hsutil';   const log = gLog('Bubble');
import { SeriesPlot }           from '../SeriesPlot';
import { Series }               from '../Series';
import { GraphCfg }             from '../GraphComponent'; 


class Line extends SeriesPlot {
    /**
     * plot constructor
     * @param cx string column name for x-center coordinates
     * @param cy string column name for y-center coordinates
     */
    constructor(cfg:GraphCfg, seriesName:string, protected cx:string, protected cy:string) {
        super(cfg, seriesName, cx, cy);
    }
} 

Series.register('line', (cfg:GraphCfg, sName:string, cx:string, cy:string) => new Line(cfg, sName, cx, cy));
