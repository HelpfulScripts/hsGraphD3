/**
 * # Area Plot
 * 
 * plots a 2D area.
 * 
 * ## Usage
 * `graph.addSeries('area', {x:<x-col>, y:<y-col>, y0?:<lower-area-bound>, r?:<size-col>});`
 * 
 * ## Example
 * <example height=200px libs={hsGraphD3:'hsGraphD3'}>
 * <file name='script.js'>
 * const graph = new hsGraphD3.GraphCartesian(root);
 * graph.addSeries('area', {x:'time', y:'volume', r:'costs'});
 * graph.addSeries('area', {x:'time', y:'costs'});
 * graph.defaults.series.series0.marker.rendered = true;
 * graph.render({
 *    colNames:['time', 'volume', 'costs'], 
 *    rows:[    [-1,    0.2,      0.3], 
 *              [0.2,   0.7,      0.2], 
 *              [0.4,   0.1,      0.3],
 *              [0.6,  -0.2,      0.1], 
 *              [0.8,   0.3,      0.5], 
 *              [1,     0.2,      0.4]]
 * });
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
 *      graph.addSeries('area', {x:'time', y:'volume', r:'costs'});
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

import { log as gLog }          from 'hsutil';   const log = gLog('Area');
import { NumericSeriesPlot }    from '../NumericSeriesPlot';
import { CartSeriesDimensions } from '../CartSeriesPlot';
import { SeriesPlotDefaults }   from '../SeriesPlot';
import { GraphCfg}              from '../GraphComponent';
import { Series }               from '../Series';

Series.register('area', (cfg:GraphCfg, sName:string, dims:CartSeriesDimensions) => new Area(cfg, sName, dims));
 
export class Area extends NumericSeriesPlot {
    getDefaults(): SeriesPlotDefaults {
        const def = super.getDefaults();
        def.area.rendered = true;
        def.marker.rendered = false;
        def.line.rendered = false;
        return def;
    } 
}
 
 