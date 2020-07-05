/**
 * # Bubble Plot
 * 
 * ## Usage
 * `graph.add('bubble', {x:<x-col>, y:<y-col>, r:<size-col>});`
 * - `<dim>`: the semantic dimension to set. See {@link CartSeriesPlot.CartSeriesDimensions CartSeriesDimensions} for valid dimensions. 
 * - `<ValueDef>`: the {@link SeriesPlot.ValueDef value definition}. 
 * 
 * ## Example
 * <example height=200px libs={hsGraphD3:'hsGraphD3'}>
 * <file name='script.js'>
 * // create data set:
 * const data = {
 *    colNames: ['date', 'time', 'volume', 'costs'], 
 *    rows:[    ['1/1/14', -1,     0.2,      0.3], 
 *              ['1/1/16', 0.2,    0.7,      0.2], 
 *              ['9/1/16', 0.4,    0.1,      0.3],
 *              ['5/1/17', 0.6,   -0.2,      0.1], 
 *              ['7/1/18', 0.8,    0.3,      0.5], 
 *              ['1/1/19', 1,      0.2,      0.4]]
 * };
 * 
 * // setup and plot the data:
 * const graph = new hsGraphD3.Graph(root);
 * graph.add('bubble', {x:'time', y:'volume', r:'costs', label:i=>i});
 * graph.series.defaults[0].label.xpos = 'center';
 * graph.series.defaults[0].label.ypos = 'bottom';
 * graph.render(data);
 * 
 * </file>
 * </example>
 * 
 * 
 * ## Bubble plot Default Settings:
 * <example height=600px libs={hsGraphD3:'hsGraphD3', hsUtil:'hsUtil'}>
 * <file name='script.js'>
 * const log = new hsUtil.Log('');
 * let defaults;
 * 
 * function createGraph(svgRoot) {
 *      const graph = new hsGraphD3.Graph(svgRoot);
 *      graph.add('bubble', {x:'time', y:'volume', r:'costs'});
 *      return graph.series.defaults[0];
 * }
 * 
 * m.mount(root, {
 *   view:() => m('div', {style:'background-color:#eee; font-family:Monospace'}, [
 *      m('div', m.trust('graph.series.defaults[0] = ' + defaults)), 
 *      m('div.myGraph', '')
 *   ]),
 *   oncreate: () => {
 *      const svgRoot = root.getElementsByClassName('myGraph');
 *      if (svgRoot && svgRoot.length && !defaults) { 
 *          const colors = ['#800', '#080', '#008'];
 *          defaults = log.inspect(createGraph(svgRoot[0]), {})
 *              .replace(/\n/g, '<br>')
 *      }
 *   } 
 * });
 * </file>
 * </example>
 */

 /** */

import { Log }                  from 'hsutil'; const log = new Log('Bubble');
import { SeriesPlotNumeric }    from '../SeriesPlotNumeric';
import { SeriesPlotDefaults }   from '../SeriesPlot';
import { CartSeriesDimensions } from '../SeriesPlotCartesian';
import { GraphCfg}              from '../GraphComponent';
import { Series }               from '../Series';

Series.register('bubble', (cfg:GraphCfg, sName:string, dims:CartSeriesDimensions) => new Bubble(cfg, sName, dims));

export class Bubble extends SeriesPlotNumeric {
    getDefaults(): SeriesPlotDefaults {
        const def = super.getDefaults();
        def.area.rendered = false;
        def.marker.rendered = true;
        def.line.rendered = false;
        return def;
    } 
} 
