/**
 * # Area Plot
 * 
 * plots a 2D area with markers.
 * 
 * ## Usage
 * `graph.addSeries('area', <x-col>, <y-col>, [<size-col>]);`
 * Invoke an `area` series by adding a new series to the graph
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
 * graph.addSeries('area', 'time', 'volume', 'costs');
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
 *      graph.addSeries('area', 'time', 'volume', 'costs');
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
 import { SeriesPlot }           from '../SeriesPlot';
 import { SeriesPlotDefaults }   from '../SeriesPlot';
 
 export class Area extends SeriesPlot {
     getDefaults(): SeriesPlotDefaults {
         const def = super.getDefaults();
         def.area.color = '#88f';
         def.area.opacity = 0.5;
         def.area.rendered = true;
         return def;
     } 
 }
 
 