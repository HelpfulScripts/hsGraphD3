/**
 * # Columns Plot
 * 
 * ## Usage
 * `graph.add('column', {x:<x-col>, y:<y-col>, , ...<dim>:<ValueDef>});`
 * - `<dim>` is the semantic dimension to set. See {@link CartSeriesPlot.CartSeriesDimensions CartSeriesDimensions} for valid dimensions. 
 * - `<ValueDef>` is the {@link SeriesPlot.ValueDef value definition}. 
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
 * const graph = new hsGraphD3.Graph(root);
 * graph.add('column', {x:'State', y:'costs', label:'State', popup:'costs'});
 * graph.add('column', {x:'State', y:'volume', label:'State', popup:'volume'});
 * with (graph.scales.defaults.dims.hor.ordinal) {
 *      gap = 0.25;
 *      overlap = 0.75;
 * }
 * with (graph.series.defaults) {
 *      series0.line.rendered = true
 *      series0.label.xpos = 'left';
 *      series0.label.ypos = 0;
 *      series1.line.rendered = true
 *      series1.label.xpos = 1;
 *      series1.label.ypos = 'bottom';
 * }
 * graph.grids.defaults.ver.major.rendered = false;
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
 * ## Example for stacking
 * <example height=200px libs={hsGraphD3:'hsGraphD3'}>
 * <file name='script.js'>
 * // create data set:
 * const data = {
 *    colNames: ['State', 'volume', 'costs'], 
 *    rows:[    ['CA',      0.0,     0.2], 
 *              ['MA',      0.2,     0.7], 
 *              ['FL',      0.4,     0.1],
 *              ['SC',      0.6,     0.2], 
 *              ['NV',      0.8,     0.3], 
 *              ['NC',      1,       0.2]]
 * };
 * 
 * // setup and plot the data:
 * const graph = new hsGraphD3.Graph(root);
 * graph.add('column', {x:'State', y:'costs',  stacked:'group1', label:i=>`costs ${i}`});
 * graph.add('column', {x:'State', y:'volume', stacked:'group1', label:'volume'});
 * graph.scales.defaults.dims.hor.ordinal.gap = 0.25;
 * with (graph.series.defaults) {
 *      series0.line.rendered = true;
 *      series0.label.ypos = 'top';
 *      series1.label.inside = false;
 *      series1.label.xpos = 'right';
 *      series1.label.ypos = 'top';
 *      series1.line.rendered = true;
 * }
 * graph.grids.defaults.ver.major.rendered = false;
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
 * ### Column plot Default Settings:
 * <example height=600px libs={hsGraphD3:'hsGraphD3', hsUtil:'hsUtil'}>
 * <file name='script.js'>
 * const log = new hsUtil.Log('');
 * let defaults;
 * 
 * function createGraph(svgRoot) {
 *      const graph = new hsGraphD3.Graph(svgRoot);
 *      graph.add('column', {x:'State', y:'costs', label:'State', popup:'costs'});
 *      graph.add('column', {x:'State', y:'volume', popup:'volume'});
 *      with (graph.scales.defaults.dims.hor.ordinal) {
 *          gap = 0.25;
 *          overlap = 0.75;
 *      }
 *      with (graph.series.defaults) {
 *          series0.line.rendered = true
 *          series1.line.rendered = true
 *      }
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
 *          //const colors = ['#800', '#080', '#008'];
 *          const graph = createGraph(svgRoot[0]);
 *          defaults = `<b>graph.series.defaults = </b>` +
 *              `${log.inspect(graph.series.defaults, {}).replace(/\n/g, '<br>')}` +
 *              `<br><br><b>graph.scales.defaults.dims = </b>` +
 *              `${log.inspect(graph.scales.defaults.dims, {}).replace(/\n/g, '<br>')}`;
 *      }
 *   } 
 * });
 * </file>
 * </example>
 */

 /** */

import { Log }                  from 'hsutil'; const log = new Log('Column');
import { CartSeriesDimensions } from '../SeriesPlotCartesian';
import { GraphCfg}              from '../GraphComponent';
import { Series }               from '../Series';
import { SeriesPlotOrdinal }    from '../SeriesPlotOrdinal';
import { SeriesPlotDefaults }   from '../SeriesPlot';

Series.register('column', (cfg:GraphCfg, sName:string, dims:CartSeriesDimensions) => new Column(cfg, sName, dims));


export class Column extends SeriesPlotOrdinal {
    protected abscissa:'hor'|'ver'= 'hor';

    getDefaults(): SeriesPlotDefaults {
        const gridDef = this.cfg.graph.defaults.grids.ver;
        gridDef.major.rendered = false;
        gridDef.minor.rendered = false;
        return super.getDefaults();
    } 
} 
