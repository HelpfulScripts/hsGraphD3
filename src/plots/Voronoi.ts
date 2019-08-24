/**
 * # Voronoi Plot
 * 
 * plots a 2D Voronoi Partition.
 * 
 * ## Usage
 * `graph.addSeries('voronoi', <x-col>, <y-col>, [<size-col>]);`
 * Invoke a `line` series by adding a new series to the graph
 * 
 * ## Example
 * <example height=200px libs={hsGraphD3:'hsGraphD3'}>
 * <file name='script.js'>
 * 
 * const data = {
 *    colNames: ['x', 'y'],
 *    rows: []
 * }
 * let i = 0;
 * while (i++<100) {
 *      data.rows.push([Math.random(), Math.random()]);
 * }
 * 
 * const graph = new hsGraphD3.GraphCartesian(root);
 * graph.addSeries('voronoi', 'x', 'y');
 * with (graph.defaults) {
 *      axes.rendered = false;
 *      series.series0.line.width = 1;
 *      series.series0.line.color = '#0c0';
 *      series.series0.marker.size = 3;
 *      grids.rendered = false;
 * }
 * graph.render(data, 100, data => {
 *      data.rows.forEach(row => {
 *          row[0] += (Math.random()-0.5)/100;
 *          row[1] += (Math.random()-0.5)/100;
 *      })
 *      return true;
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
 *      const graph = new hsGraphD3.GraphCartesian(root);
 *      graph.addSeries('voronoi', 'x', 'y');
 *      with (graph.defaults) {
 *          axes.rendered = false;
 *          series.series0.line.width = 1;
 *          series.series0.line.color = '#0c0';
 *          series.series0.marker.size = 3;
 *          grids.rendered = false;
 *      }
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

import { log as gLog }          from 'hsutil';   const log = gLog('Bubble');
import { Delaunay}              from "d3-delaunay/";
import { Voronoi as d3Voronoi} from "d3-delaunay/";
import { SeriesPlot }           from '../SeriesPlot';
import { DataSet }              from '../Graph';
import { d3Base }               from '../Settings';
import { SeriesPlotDefaults }   from '../SeriesPlot';

export class Voronoi extends SeriesPlot {
    private voronoi: d3Voronoi<number>;

    renderComponent(data:DataSet): void {
        const scales = this.cfg.scales;
        const x = this.cols[0];
        const y = this.cols[1];
        this.voronoi = Delaunay.from(data.rows, 
            r => scales.hor(<number>r[x]),
            r => scales.ver(<number>r[y])
        ).voronoi([0, 0, this.cfg.viewPort.width, this.cfg.viewPort.height]);
        super.renderComponent(data);
    }

    d3RenderPath(svg:d3Base, data:DataSet) {
        const defaults = (<SeriesPlotDefaults>this.cfg.defaults.series[this.key]).line;
        if (defaults.rendered) {
            const path = svg.selectAll('path')
                .transition(this.cfg.transition)
                .attr('d', this.voronoi.render());
        }
    } } 
 
 