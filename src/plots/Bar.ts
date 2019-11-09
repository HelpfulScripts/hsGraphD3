/**
 * # Bar Plot
 * 
 * ## Usage
 * `graph.addSeries('bar', {x:<x-col>, y:<y-col>});`
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
 * graph.addSeries('bar', {y:'State', x:'costs'});
 * graph.defaults.scales.dims.ver.type = 'ordinal';
 * graph.defaults.series[0].gap = 0.5;
 * graph.defaults.grids.hor.major.rendered = false;
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
 *      graph.addSeries('bar', {y:'state', x:'volume'});
 *      graph.defaults.scales.dims.ver.type = 'ordinal';
 *      graph.defaults.series[0].gap = 0.5;
 *      graph.defaults.grids.hor.major.rendered = false;
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

Series.register('bar', (cfg:GraphCfg, sName:string, dims:CartSeriesDimensions) => new Bar(cfg, sName, dims));


export class Bar extends OrdinalSeriesPlot {
    preRender(data:DataSet, domains:Domains): void {
        super.preRender(data, domains);
        const def = (<OrdinalPlotDefaults>this.cfg.defaults.series[this.key]);
        this.cfg.scales.ver.padding(def.gap);
    }

    protected d3DrawBar(markers:d3Base, plot:Bar, colNames:string[]) {
        const xAccess  = accessor(plot.dims.x, colNames, plot.cfg.scales.hor);
        const yAccess  = accessor(plot.dims.y, colNames, plot.cfg.scales.ver);
        const x0 = accessor(()=>0, colNames, plot.cfg.scales.hor)([]);
        const step = plot.cfg.scales.ver.step();
        const pad = this.cfg.scales.ver.padding();
        const height = step * (1 - pad);
        markers
            .attr("y",  (d:number[]) => yAccess(d) + step*pad/2)
            .attr("x",  (d:number[]) => Math.min(xAccess(d), x0))
            .attr("height",  () => height)
            .attr("width", (d:number[]) => Math.abs(x0-xAccess(d)));
    }
} 
   