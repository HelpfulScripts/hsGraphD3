/**
 * # Voronoi Plot
 * 
 * plots a 2D Voronoi Partition.
 * 
 * ## Usage
 * `graph.series.add('voronoi', {x:<x-col>, y:<y-col>, r?:<size-col>});`
 * Invoke a `line` series by adding a new series to the graph
 * 
 * ## Example
 * - Generate 1000 samples per frame.
 * - for each frame: 
 *     - calculate the centroids 
 *     - plot centroids and voronoi diagram
 *     - split any centroid that has observed more than 10k samples
 * <example height=200px libs={hsGraphD3:'hsGraphD3'}>
 * <file name='script.js'>
 * 
 * const centroids = {
 *     colNames: ['x', 'y', 'count'],
 *     rows: [[0.5, 0.5, 0]]
 * }
 * const samples = {
 *     colNames: ['x', 'y', 'nearest'],
 *     rows: [[0.5, 0.5, 0]]
 * }
 * let w = 20;
 * const numSamples = 1000;
 * 
 * const graph = new hsGraphD3.GraphCartesian(root);
 * 
 * graph.series.add('voronoi', {x:'x', y:'y', r:'count'});
 * graph.series.add('bubble', {x:'x', y:'y'});
 * 
 * with (graph.defaults) {
 *     graph.transition.duration = 0;
 *     axes.rendered = false;
 *     series.series0.line.width = 1;
 *     series.series0.marker.size = 3;
 *     series.series0.marker.stroke.width = 0;
 *     series.series1.marker.size = 1;
 *     series.series1.marker.stroke.width = 0;
 *     series.series1.marker.fill.color = '#000';
 *     grids.rendered = false;
 *     scales.margin.bottom = 0;
 *     scales.margin.left = 0;
 *     scales.margin.rigth = 0;
 * }
 * 
 * const getRnd = () => (Math.random() + Math.random() + Math.random()) / 3;
 * 
 * graph.render([centroids, samples]).update(200, data => {
 *     data[1].rows = Array.from({length: numSamples}, v => [getRnd(), getRnd(), 0]);
 *     data[1].rows.map(r => r[2] = hsGraphD3.Voronoi.nearest(r, data[0].rows));
 *     data[0].rows.map((row, i) => {
 *         const smp = data[1].rows.filter(r => r[2]===i);
 *         const cnt = smp.length;
 *         const w = row[2];
 *         const norm = 1 / (cnt+w);
 *         const c = hsGraphD3.Voronoi.centroid(smp);
 *         row[0] = (w*row[0] + cnt*c[0])*norm;
 *         row[1] = (w*row[1] + cnt*c[1])*norm;
 *         row[2] += cnt/2;
 *     });
 *     // split if enough count
 *     data[0].rows.filter(row => row[2] > 10000)
 *         .map((row, i) => {
 *             const dx = Math.random()/10000;
 *             const dy = Math.random()/10000;
 *             row[0] += dx;   row[1] += dy;
 *             row[2] = 500;
 *             data[0].rows.push([row[0]-dx, row[1]-dy, row[2]]);
 *          })
 * });
 * 
 * </file>
 * </example>
 * 
 * ### Voronoi plot Default Settings:
 * <example height=600px libs={hsGraphD3:'hsGraphD3', hsUtil:'hsUtil'}>
 * <file name='script.js'>
 * const log = new hsUtil.Log('');
 * let defaults;
 * 
 * function createGraph(svgRoot) {
 *      const graph = new hsGraphD3.GraphCartesian(root);
 *      graph.series.add('voronoi', {x:'x', y:'y', r:'count'});
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
 *          defaults = log.inspect(createGraph(svgRoot[0]), null, '   ', colors)
 *              .replace(/\n/g, '<br>')
 *      }
 *   } 
 * });
 * </file>
 * </example>
 */

 /** */

import { Log }                  from 'hsutil'; const log = new Log('Voronoi');
import { Delaunay}              from "d3-delaunay";
import { Voronoi as d3Voronoi}  from "d3-delaunay";
import { NumericSeriesPlot }    from './NumericSeriesPlot';
import { CartSeriesDimensions, CartSeriesPlot } from '../CartSeriesPlot';
import { NumericDataSet }       from '../Graph';
import { d3Base }               from '../Settings';
import { SeriesPlotDefaults }   from '../SeriesPlot';
import { ScalesDefaults }       from '../Scale';
import { GraphCfg}              from '../GraphComponent';
import { Series }               from '../Series';

Series.register('voronoi', (cfg:GraphCfg, sName:string, dims:CartSeriesDimensions) => new Voronoi(cfg, sName, dims));

export class Voronoi extends NumericSeriesPlot {
    private voronoi: d3Voronoi<number>;

    getDefaults(): SeriesPlotDefaults {
        const def = super.getDefaults();
        def.marker.rendered = true;
        def.line.rendered = true;
        return def;
    } 

    public renderComponent(data:NumericDataSet): void {
        const scales = this.cfg.graph.scales.scaleDims;
        if (typeof(this.dims.x)==='number') { log.warn(`renderComponent: unsupported const x=${this.dims.x} in voronoi`); }
        if (typeof(this.dims.y)==='number') { log.warn(`renderComponent: unsupported const y=${this.dims.y} in voronoi`); }
        const x = data.colNames.indexOf(<string>this.dims.x);
        const y = data.colNames.indexOf(<string>this.dims.y);
        const m = this.cfg.graph.scales.defaults.margin;
        this.voronoi = Delaunay.from(data.rows, 
            r => scales.hor(<number>r[x]),
            r => scales.ver(<number>r[y])
        )
        .voronoi([0, 0, this.cfg.viewPort.width, this.cfg.viewPort.height]);
        super.renderComponent(data);
    }

    protected d3RenderLine(svg:d3Base, data:NumericDataSet) {
        const defaults = this.defaults.line;
        if (defaults.rendered) {
            const path = svg.selectAll('path')
                .transition(this.cfg.transition)
                .attr('d', this.voronoi.render());
        }
    } 

    //----------- static support methods for Voronoi Diagrams

    /**
     * Calculates the nearest `anchor` to the `sample` vector ands returns its index in the `anchors` array.
     * @param sample 
     * @param anchors 
     */
    static nearest(sample:number[], anchors:number[][]) {
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
     * Calculates the centroid (average) vector over the array of sample vectors.
     * @param samples 
     * @param weight 
     * @return the centroid vector as an array
     */
    static centroid(samples:number[][]) {
        const sum = samples.reduce((acc, s) => { 
            acc[0] += s[0]; 
            acc[1] += s[1]; 
            return acc; 
        }, [0, 0]);
        return samples.length? [sum[0]/samples.length, sum[1]/samples.length] : [0,0];
    }
} 
