/**
 * # Line Plot
 * 
 * plots a 2D line. Defers to {@link SeriesPlotNumeric SeriesPlotNumeric} to render plot elements and uses the 
 * default configuration to
 * - show the plot line
 * - hide the plot markers
 * - hide the plot area
 * Each of these can be modified via changing the {@link Settings default settings}.
 * 
 * ## Usage
 * `graph.add('line', {x:<x-col>, y:<y-col>, , ...<dim>:<ValueDef>});`
 * - `<dim>` is the semantic dimension to set. See {@link CartSeriesPlot.CartSeriesDimensions CartSeriesDimensions} for valid dimensions. 
 * - `<ValueDef>` is the {@link SeriesPlot.ValueDef value definition}. 
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
 * const graph = new hsGraphD3.Graph(root);
 * graph.add('line', {x:'time', y:'volume', r:'costs'});
 * graph.add('line', {x:'time', y:()=>0.5});
 * graph.render(data);
 * 
 * </file>
 * </example>
 * <example height=200px libs={hsGraphD3:'hsGraphD3'}>
 * <file name='script.js'>
 * // create data set:
 * const data = {
 *    colNames:['date', 'time', 'volume', 'costs'], 
 *    rows:[[new Date('1/1/14'), -1,   0.2, 0.3], [new Date('1/1/16'), 0.2, 0.7, 0.2], [new Date('9/1/16'), 0.4, 0.1, 0.3],
 *          [new Date('5/1/17'), 0.6, -0.2, 0.1], [new Date('7/1/18'), 0.8, 0.3, 0.5], [new Date('1/1/19'), 1,   0.2, 0.4]]
 * };
 * 
 * const graph = new hsGraphD3.Graph(root);
 * graph.add('line', {x:'date', y:'volume', r:'costs'});
 * graph.add('line', {x:'date', y:()=>0.5});
 * graph.defaults.scales.dims.hor.type = 'time';
 * graph.render(data);
 * 
 * </file>
 * </example>
 * 
 * ### Line plot Default Settings:
 * <example height=600px libs={hsGraphD3:'hsGraphD3', hsUtil:'hsUtil'}>
 * <file name='script.js'>
 * const log = new hsUtil.Log('');
 * let defaults;
 * 
 * function createGraph(svgRoot) {
 *      const graph = new hsGraphD3.Graph(svgRoot);
 *      graph.add('line', {x:'time', y:'volume', r:'costs'});
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
 *          //const colors = ['#800', '#080', '#008'];
 *          defaults = log.inspect(createGraph(svgRoot[0]), {})
 *              .replace(/\n/g, '<br>')
 *      }
 *   } 
 * });
 * </file>
 * </example>
 */

 /** */

import { Log }                  from 'hsutil'; const log = new Log('Line');
import { SeriesPlotNumeric }    from '../SeriesPlotNumeric';
import { CartSeriesDimensions } from '../SeriesPlotCartesian';
import { SeriesPlotDefaults }   from '../SeriesPlot';
import { GraphCfg}              from '../GraphComponent';
import { Series }               from '../Series';

Series.register('line', (cfg:GraphCfg, sName:string, dims: CartSeriesDimensions) => new Line(cfg, sName, dims));

export class Line extends SeriesPlotNumeric {
    getDefaults(): SeriesPlotDefaults {
        const def = super.getDefaults();
        def.line.rendered   = true;
        return def;
    } 
}

