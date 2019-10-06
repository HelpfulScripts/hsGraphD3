/**
 * # Band Plot
 * 
 * plots a 2D area between two series.
 * 
 * ## Usage
 * `graph.addSeries('band', {x:<x-col>, y:<y1-col>, y0:<y2-col>, r?:<size-col>});`
 * 
 * ## Example
 * <example height=200px libs={hsGraphD3:'hsGraphD3'}>
 * <file name='script.js'>
 * const graph = new hsGraphD3.GraphCartesian(root);
 * graph.addSeries('band', {x:'time', y:'costs', y0:'volume'});
 * graph.addSeries('area', {x:'time', y:'volume'});
 * graph.render({
 *    colNames:['time', 'volume', 'costs'], 
 *    rows:[    [-1,    0.2,      0.3], 
 *              [0.2,   0.3,      0.7], 
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
 *      graph.addSeries('band', {x:'time', y:'volume', y0:'costs'});
 *      graph.addSeries('area', {x:'time', y:'costs'});
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
import { log as gLog }          from 'hsutil';   const log = gLog('Band');
import { SeriesPlot }           from '../SeriesPlot';
import { CartSeriesDimensions }     from '../SeriesPlot';
import { SeriesPlotDefaults }   from '../SeriesPlot';
import { GraphCfg}              from '../GraphComponent';
import { Series }               from '../Series';
import { line as d3line}        from "d3";
import { Line as d3Line}        from "d3";
import { curveCatmullRom }      from 'd3';
import { DataSet }              from '../Graph';

Series.register('band', (cfg:GraphCfg, sName:string, dims:CartSeriesDimensions) => new Band(cfg, sName, dims));

export class Band extends SeriesPlot {
    getDefaults(): SeriesPlotDefaults {
        const def = super.getDefaults();
        def.area.rendered = true;
        def.marker.rendered = false;
        def.line.rendered = false;
        return def;
    } 

    protected getFillClosing(data:DataSet):string {
        log.info('closing with reverse 2nd line');
        const x = data.colNames.indexOf(this.dims.x);
        const y0 = data.colNames.indexOf(this.dims.y0);
        const line:d3Line<number[]> = d3line()
            .x(d => this.cfg.scales.hor(d[x]))
            .y(d => this.cfg.scales.ver(d[y0]))
            .curve(curveCatmullRom.alpha(0.2));        
        const _data = <number[][]>data.rows.reverse();
        return `L${this.cfg.scales.hor(_data[0][x])},${this.cfg.scales.ver(_data[0][y0])}`
            + line(_data).slice(8); // remove first 'M' command
    }
}
 

/*
M                                                                           20,221
C20,221,487.98627799954477,29.99406640139239,                               596,50
C684.9272537093758,66.47080296713418,658.2951506077754,203.6935252928828,   692,256
C722.5952197550583,303.4806479522748,757.0063241770496,366.17700750410165,  788,358
C821.1513124118072,349.25374699307423,849.6131533245314,206.75253714701844, 884,187
C914.1634534393586,169.67346988322925,980,221,                              980,221
L                                                                           980,153
M                                                                           980,221
C980,221,914.1634534393586,169.67346988322925,                              884,187
C849.6131533245314,206.7525371470184,821.1513124118071,349.25374699307423,  788,358
C757.0063241770496,366.17700750410165,722.5952197550583,303.4806479522748,  692,256
C658.2951506077754,203.6935252928828,684.9272537093758,66.47080296713418,   596,50
C487.9862779995448,29.994066401392384,20,221,                               20,221

M                                                                           20,221
C20,221,487.98627799954477,29.99406640139239,                               596,50
C684.9272537093758,66.47080296713418,658.2951506077754,203.6935252928828,   692,256
C722.5952197550583,303.4806479522748,757.0063241770496,366.17700750410165,  788,358
C821.1513124118072,349.25374699307423,849.6131533245314,206.75253714701844, 884,187
C914.1634534393586,169.67346988322925,980,221,                              980,221
L                                                                           980,153
M                                                                           980,153
C980,153,914.5631428329767,105.29708447231172,                              884,119
C850.2476285893157,134.1327989018439,821.1901893951944,246.71344215374285,  788,256
C757.0358903970805,264.66370455321953,724.4917008011735,192.40316465835974, 692,187
C660.4632235435664,181.7556332298296,670.9554931401178,217.67806561631184,  596,221
C489.9641385654675,225.6993777139842,20,187,                                20,187
*/
