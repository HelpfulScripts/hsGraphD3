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
 * `graph.add('area', {x:<x-col>, y:<y-col>, ...<dim>:<ValueDef>});`
 * - `<dim>` is the semantic dimension to set. See {@link CartSeriesPlot.CartSeriesDimensions CartSeriesDimensions} for valid dimensions. 
 * - `<ValueDef>` is the {@link SeriesPlot.ValueDef value definition}. 
 * 
 * ## Example
 * - first series (top): a green area-band between y0='volume' and y='costs', not using markers
 * - second series (bottom): an orange area between 'volume' and the x-axis (y0=0), using markers sized by 'costs'
 * <example height=200px libs={hsGraphD3:'hsGraphD3'}>
 * <file name='script.js'>
 * const graph = new hsGraphD3.Graph(root);
 * graph.add('area', {x:'time', y:'volume', r:'volume', label:'volume'});
 * graph.add('area', {x:'time', y:'costs', r:'costs', y0:'volume', label:'costs'});
 * graph.series.defaults[0].line.rendered = true;
 * graph.series.defaults[1].line.rendered = true;
 * graph.render({
 *    colNames:['time', 'volume', 'costs'], 
 *    rows:[    [-1,    0.2,      0.3], 
 *              [0.2,   0.4,      0.7], 
 *              [0.4,   0.0,      0.3],
 *              [0.6,   0.2,      0.2], 
 *              [0.8,   0.3,      0.5], 
 *              [1,     0.2,      0.4]]
 * });
 * 
 * </file>
 * </example>
 * 
 * ## Example for stacked series
 * - first series (bottom): a green area-band between the x-axis and y='costs', not using markers
 * - second series (top): am orange area on to of the first for y='volume', using markers sized by 'costs'
 * <example height=200px libs={hsGraphD3:'hsGraphD3'}>
 * <file name='script.js'>
 * const graph = new hsGraphD3.Graph(root);
 * graph.add('area', {x:'time', y:'volume', r:'volume', stacked:'mystack', label:'volume'});
 * graph.add('area', {x:'time', y:'costs', r:'costs', stacked:'mystack', label:'costs'});
 * graph.series.defaults[0].line.rendered = true;
 * graph.series.defaults[1].line.rendered = true;
 * graph.render({
 *    colNames:['time', 'volume', 'costs'], 
 *    rows:[    [-1,    0.2,      0.3], 
 *              [0.2,   0.4,      0.7], 
 *              [0.4,   0.0,      0.3],
 *              [0.6,   0.2,      0.2], 
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
 * const log = new hsUtil.Log('');
 * let defaults;
 * 
 * function createGraph(svgRoot) {
 *      const graph = new hsGraphD3.Graph(svgRoot);
 *      graph.add('area', {x:'time', y:'costs', stacked:'mystack'});
 *      graph.add('area', {x:'time', y:'volume', r:'costs', stacked:'mystack'});
 *      return graph.series.defaults;
 * }
 * 
 * m.mount(root, {
 *   view:() => m('div', {style:'background-color:#eee; font-family:Monospace'}, [
 *      m('div', m.trust('graph.series.defaults = ' + defaults)), 
 *      m('div.myGraph', '')
 *   ]),
 *   oncreate: () => {
 *      const svgRoot = root.getElementsByClassName('myGraph');
 *      if (svgRoot && svgRoot.length && !defaults) { 
 *          const colors = ['#800', '#080', '#008'];
 *          defaults = log.inspect(createGraph(svgRoot[0]), null, '   ', colors)
 *              .replace(/\n/g, '<br>')
 *      }
 *   } 
 * });
 * </file>
 * </example>
 */

 /** */

import { Log }                  from 'hsutil'; const log = new Log('Area');
import { SeriesPlotNumeric }    from '../SeriesPlotNumeric';
import { CartSeriesDimensions } from '../SeriesPlotCartesian';
import { SeriesPlotDefaults }   from '../SeriesPlot';
import { GraphCfg}              from '../GraphComponent';
import { Series }               from '../Series';

Series.register('area', (cfg:GraphCfg, sName:string, dims:CartSeriesDimensions) => new Area(cfg, sName, dims));
 
export class Area extends SeriesPlotNumeric {
    getDefaults(): SeriesPlotDefaults {
        const def = super.getDefaults();
        def.area.rendered = true;
        return def;
    } 
}
 
 