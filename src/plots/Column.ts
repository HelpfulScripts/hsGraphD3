/**
 * # Columns Plot
 * 
 * ## Usage
 * `graph.addSeries('column', {x:<x-col>, y:<y-col>});`
 * 
 * ## Example
 * <example height=200px libs={hsGraphD3:'hsGraphD3'}>
 * <file name='script.js'>
 * // create data set:
 * const data = {
 *    colNames: ['State', 'volume', 'costs'], 
 *    rows:[    ['CA',     -1,       0.2], 
 *              ['MA',      0.2,     0.7], 
 *              ['FL',      0.4,     0.1],
 *              ['SC',      0.6,    -0.2], 
 *              ['NV',      0.8,     0.3], 
 *              ['NC',      1,       0.2]]
 * };
 * 
 * // setup and plot the data:
 * const graph = new hsGraphD3.GraphCartesian(root);
 * graph.addSeries('column', {x:'State', y:'costs'});
 * graph.defaults.scales.dims.hor.type = 'ordinal';
 * graph.defaults.series[0].gap = 0.5;
 * graph.defaults.grids.ver.major.rendered = false;
 * graph.render(data).update(1000, data => {
 *      data.rows.forEach(row => row[2] = 1.2*Math.random()-0.2);
 *      return true;
 * });
 * 
 * </file>
 * </example>
 * 
 * 
 * ### Accessible format setting and defaults (for a cartesian graph):
 * <example height=600px libs={hsGraphD3:'hsGraphD3', hsUtil:'hsUtil'}>
 * <file name='script.js'>
 * const log = hsUtil.log('');
 * let defaults;
 * 
 * function createGraph(svgRoot) {
 *      const graph = new hsGraphD3.GraphCartesian(svgRoot);
 *      graph.addSeries('column', {x:'state', y:'volume'});
 *      graph.defaults.scales.dims.hor.type = 'ordinal';
 *      graph.defaults.series[0].gap = 0.5;
 *      graph.defaults.grids.ver.major.rendered = false;
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

import { log as gLog }          from 'hsutil';   const log = gLog('Column');
import { DataSet, Domains }     from '../Graph';
import { accessor }             from './NumericSeriesPlot';
import { CartSeriesDimensions } from '../CartSeriesPlot';
import { GraphCfg}              from '../GraphComponent';
import { Series }               from '../Series';
import { d3Base }               from '../Settings';
import { OrdinalSeriesPlot }    from './OrdinalSeriesPlot';
import { OrdinalPlotDefaults }  from './OrdinalSeriesPlot';

Series.register('column', (cfg:GraphCfg, sName:string, dims:CartSeriesDimensions) => new Column(cfg, sName, dims));


export class Column extends OrdinalSeriesPlot {
    preRender(data:DataSet, domains:Domains): void {
        super.preRender(data, domains);
        const def = (<OrdinalPlotDefaults>this.cfg.defaults.series[this.key]);
        this.cfg.scales.hor.padding(def.gap);
    }
 
    protected d3DrawBar(markers:d3Base, plot:Column, colNames:string[]) {
        const xAccess  = accessor(plot.dims.x, colNames, plot.cfg.scales.hor);
        const yAccess  = accessor(plot.dims.y, colNames, plot.cfg.scales.ver);
        const y0 = accessor(()=>0, colNames, plot.cfg.scales.ver)([]);
        const step = plot.cfg.scales.hor.step();
        const pad = this.cfg.scales.hor.padding();
        const width = step * (1 - pad);
        markers
            .attr("x",  (d:number[]) => xAccess(d) + step*pad/2)
            .attr("y",  (d:number[]) => Math.min(yAccess(d), y0))
            .attr("width",  () => width)
            .attr("height", (d:number[]) => Math.abs(y0-yAccess(d)));
    }
} 
  