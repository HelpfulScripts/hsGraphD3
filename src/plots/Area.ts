/**
 * # Area Plot
 * 
 * plots a 2D area. Defers to {@link NumericSeriesPlot NumericSeriesPlot} to render plot elements and uses the 
 * default configuration to
 * - hide the plot line
 * - hide the plot markers
 * - show the plot area
 * Each of these can be modified via changing the {@link Settings default settings}.

 * 
 * ## Usage
 * `graph.addSeries('area', {x:<x-col>, y:<y-col>, y0:<y-lower-fill>=0, r?:<size-col>});`
 * 
 * ## Example
 * - first series (top): an orange area-band between 'costs' and 'volume', not using markers
 * - second series (bottom): a green area between 'volume' and the x-axis (y0=0), using markers sized by 'costs'
 * <example height=200px libs={hsGraphD3:'hsGraphD3'}>
 * <file name='script.js'>
 * const graph = new hsGraphD3.GraphCartesian(root);
 * graph.addSeries('area', {x:'time', y:'costs', y0:'volume'});
 * graph.addSeries('area', {x:'time', y:'volume', r:'costs'});
 * graph.render({
 *    colNames:['time', 'volume', 'costs'], 
 *    rows:[    [-1,    0.2,      0.3], 
 *              [0.2,   0.4,      0.7], 
 *              [0.4,   0.1,      0.3],
 *              [0.6,  -0.2,      0.1], 
 *              [0.8,   0.3,      0.5], 
 *              [1,     0.2,      0.4]]
 * });
 * 
 * </file>
 * </example>
 * 
 * ### Area plot Default Settings:
 * <example height=600px libs={hsGraphD3:'hsGraphD3', hsUtil:'hsUtil'}>
 * <file name='script.js'>
 * const log = hsUtil.log('');
 * let defaults;
 * 
 * function createGraph(svgRoot) {
 *      const graph = new hsGraphD3.GraphCartesian(svgRoot);
 *      graph.addSeries('area', {x:'time', y:'volume', r:'costs'});
 *      return graph.defaults.series[0];
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

import { log as gLog }          from 'hsutil';   const log = gLog('Area');
import { NumericSeriesPlot }    from './NumericSeriesPlot';
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
 
 