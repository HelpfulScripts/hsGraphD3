/**
 * # Columns Plot
 * 
 * ## Usage
 * `graph.series.add('column', {x:<x-col>, y:<y-col>, stacked?:<group-name>});`
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
 * graph.series.add('column', {x:'State', y:'costs'});
 * graph.series.add('column', {x:'State', y:'volume'});
 * graph.scales.defaults.dims.hor.ordinal.gap = 0.25;
 * graph.scales.defaults.dims.hor.ordinal.overlap = 0.75;
 * graph.series.defaults[0].line.rendered = true;
 * graph.series.defaults[1].line.rendered = true;
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
 * const graph = new hsGraphD3.GraphCartesian(root);
 * graph.series.add('column', {x:'State', y:'costs',  stacked:'group1'});
 * graph.series.add('column', {x:'State', y:'volume', stacked:'group1'});
 * graph.scales.defaults.dims.hor.ordinal.gap = 0.25;
 * graph.series.defaults[0].line.rendered = true;
 * graph.series.defaults[1].line.rendered = true;
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
 * const log = hsUtil.log('');
 * let defaults;
 * 
 * function createGraph(svgRoot) {
 *      const graph = new hsGraphD3.GraphCartesian(svgRoot);
 *      graph.series.add('column', {x:'state', y:'volume'});
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
 *          const colors = ['#800', '#080', '#008'];
 *          const graph = createGraph(svgRoot[0]);
 *          defaults = `<b>graph.series.defaults = </b>
 *              ${hsUtil.log.inspect(graph.series.defaults, null, '   ', colors).replace(/\n/g, '<br>')}
 *              <br><br><b>graph.scales.defaults.dims = </b>
 *              ${hsUtil.log.inspect(graph.scales.defaults.dims, null, '   ', colors).replace(/\n/g, '<br>')}`;
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
import { SeriesPlotDefaults }   from '../SeriesPlot';
import { GridsDefaults }         from '../Grid';

Series.register('column', (cfg:GraphCfg, sName:string, dims:CartSeriesDimensions) => new Column(cfg, sName, dims));


export class Column extends OrdinalSeriesPlot {
    protected get independentAxis():'hor' { return 'hor'; }

    getDefaults(): SeriesPlotDefaults {
        const gridDef = this.cfg.graph.defaults.grids.ver;
        gridDef.major.rendered = false;
        gridDef.minor.rendered = false;
        return super.getDefaults();
    } 
} 
