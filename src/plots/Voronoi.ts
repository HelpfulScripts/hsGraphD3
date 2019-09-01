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
 * const centroids = {
 *    colNames: ['x', 'y'],
 *    rows: Array.from({length: 20}, v => [Math.random(), Math.random()])
 * }
 * const samples = {
 *    colNames: ['x', 'y', 'nearest'],
 *    rows: [[0.5, 0.5, 0]]
 * }
 * let w = 20;
 * const numSamples = 1000;
 * 
 * const graph = new hsGraphD3.GraphCartesian(root);
 * const voronoi = graph.addSeries('voronoi', 'x', 'y');
 * graph.addSeries('bubble', 'x', 'y');
 * with (graph.defaults) {
 *      axes.rendered = false;
 *      series.series0.line.width = 1;
 *      series.series0.line.color = '#0c0';
 *      series.series0.marker.size = 3;
 *      series.series0.marker.stroke.color = '#f00';
 *      series.series1.marker.size = 1;
 *      series.series1.marker.stroke.width = 0;
 *      grids.rendered = false;
 *      scales.margin.top = 0;
 *      scales.margin.bottom = 0;
 *      scales.margin.left = 0;
 *      scales.margin.rigth = 0;
 * }
 * graph.render([centroids, samples]).update(200, data => {
 *      const norm = 1/(w+1);
 *      data[1].rows = Array.from({length: numSamples}, v => [Math.random(), Math.random(), 0]);
 *      data[1].rows.map(r => r[2] = voronoi.nearest(r, data[0].rows));
 *      data[0].rows.map((row, i) => {
 *          const c = voronoi.centroid(data[1].rows.filter(r => r[2]===i));
 *          row[0] = (w*row[0] + c.avg[0])*norm;
 *          row[1] = (w*row[1] + c.avg[1])*norm;
 *      });
 *      w += numSamples/50;
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
import { Delaunay}              from "d3-delaunay";
import { Voronoi as d3Voronoi}  from "d3-delaunay";
import { SeriesPlot }           from '../SeriesPlot';
import { DataSet }              from '../Graph';
import { d3Base }               from '../Settings';
import { SeriesPlotDefaults }   from '../SeriesPlot';
import { ScalesDefaults }       from '../Scale';

export class Voronoi extends SeriesPlot {
    private voronoi: d3Voronoi<number>;

    renderComponent(data:DataSet): void {
        const scales = this.cfg.scales;
        const x = this.cols[0];
        const y = this.cols[1];
        const m = <ScalesDefaults>this.cfg.defaults.scales.margin;
        this.voronoi = Delaunay.from(data.rows, 
            r => scales.hor(<number>r[x]),
            r => scales.ver(<number>r[y])
        ).voronoi([m.left, m.top, this.cfg.viewPort.width-m.right, this.cfg.viewPort.height-m.bottom]);
        super.renderComponent(data);
    }

    d3RenderPath(svg:d3Base, data:DataSet) {
        const defaults = (<SeriesPlotDefaults>this.cfg.defaults.series[this.key]).line;
        if (defaults.rendered) {
            const path = svg.selectAll('path')
                .transition(this.cfg.transition)
                .attr('d', this.voronoi.render());
        }
    } 

    /**
     * Calculates the nearest `anchor` to the `sample` vector ands returns the index in the `anchors` array.
     * @param sample 
     * @param anchors 
     */
    nearest(sample:number[], anchors:number[][]) {
        let best = 0;
        let dist = 1e99;
        anchors.forEach((r, i) => {
            const d = Math.pow(r[0] - sample[0], 2) + Math.pow(r[1] - sample[1], 2);
            if (d < dist) {
                dist = d;
                best = i;
            }
        });
        return best;
    }
    
    /**
     * Calculates the centroid (average) vector over the array od sample vectors.
     * @param samples 
     * @param weight 
     * @return the centroid vector
     */
    centroid(samples:number[][]) {
        const sum = [0, 0];
        let count = 0;
        
        samples.forEach(row => {
            sum[0] = sum[0] + row[0];
            sum[1] = sum[1] + row[1];
            count++;
        });
        sum[0] = count? sum[0]/count : 0;
        sum[1] = count? sum[1]/count : 0;
        return {
            avg: sum,
            count: count
        };
    }
} 
 
