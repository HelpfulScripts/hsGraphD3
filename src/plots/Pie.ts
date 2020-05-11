/**
 * # Pie Plot
 * 
 * plots a 2D pie chart. 
 * 
 * ## Usage
 * `graph.add('pie', {phi:<angle-col>, ...<dim>:<ValueDef>});`
 * - `<dim>` is the semantic dimension to set. See {@link SeriesPlotPolar.PolarSeriesDimensions PolarSeriesDimensions} for valid dimensions. 
 * - `<ValueDef>` is the {@link SeriesPlot.ValueDef value definition}. 
 * 
 * ## Example
 * Constant radius and variable pie slices
 * <example height=200px libs={hsGraphD3:'hsGraphD3'}>
 * <file name='script.js'>
 * // create data set:
 * const data = {
 *    colNames:['date', 'time', 'volume', 'costs'], 
 *    rows:[['1/1/14', -1,  0.2, 0.3], 
 *          ['1/1/16', 0.2, 0.7, 0.2], 
 *          ['9/1/16', 0.4, 0.1, 0.3],
 *          ['5/1/17', 0.6, -0.2,0.1], 
 *          ['7/1/18', 0.8, 0.3, 0.5], 
 *          ['1/1/19', 1,   0.2, 0.4]]
 * };
 * 
 * const graph = new hsGraphD3.Graph(root);
 * graph.add('pie', {phi:'costs', label:'date'});
 * graph.defaults.series.series0.marker.stroke.color = '#fff';
 * //graph.defaults.series.series0.label.xpos = 0.8;
 * graph.render(data);
 * 
 * </file>
 * </example>
 * 
 * ## Example
 * Constant angles and variable pie radii. 
 * <example height=200px libs={hsGraphD3:'hsGraphD3'}>
 * <file name='script.js'>
 * // create data set:
 * const data = {
 *    colNames:['date', 'time', 'volume', 'costs'], 
 *    rows:[['1/1/14', -1,  0.2, 0.3], 
 *          ['1/1/16', 0.2, 0.7, 0.5], 
 *          ['9/1/16', 0.4, 0.1, 0.3],
 *          ['5/1/17', 0.6, -0.2,0.3], 
 *          ['7/1/18', 0.8, 0.3, 0.5], 
 *          ['1/1/19', 1,   0.2, 0.4]]
 * };
 * 
 * const graph = new hsGraphD3.Graph(root);
 * // omitting 'phi' defaults to phi=1
 * graph.add('pie', {r:'costs', r0:0.1, label:'date'});
 * graph.defaults.series.series0.marker.stroke.color = '#fff';
 * //graph.defaults.series.series0.label.xpos = 0.8;
 * graph.render(data);
 * 
 * </file>
 * </example>
 * 
 * ### Pie plot Default Settings:
 * <example height=600px libs={hsGraphD3:'hsGraphD3', hsUtil:'hsUtil'}>
 * <file name='script.js'>
 * const log = new hsUtil.Log('');
 * let defaults;
 * 
 * function createGraph(svgRoot) {
 *      const graph = new hsGraphD3.Graph(svgRoot);
 *      graph.add('pie', {phi:'volume'});
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
 *          defaults = log.inspect(createGraph(svgRoot[0]), null, '   ', colors)
 *              .replace(/\n/g, '<br>')
 *      }
 *   } 
 * });
 * </file>
 * </example>
 */

 /** */

import { Log }                  from 'hsutil'; const log = new Log('Pie');
import { ValueDef, text }       from '../SeriesPlot';
import { GraphCfg}              from '../GraphComponent';
import { Series }               from '../Series';
import { SeriesPlotPolar }      from '../SeriesPlotPolar';
import { PolarPlotDefaults }    from '../SeriesPlotPolar';
import { PolarSeriesDimensions }from '../SeriesPlotPolar';
import { Label }                from '../Settings';
import { d3Base }               from '../Settings';
import { textPos }              from '../Settings';
import { DataRow, DataSet }     from '../Graph';
import { pie as d3Pie }         from 'd3';
import { arc as d3Arc }         from 'd3';
 
Series.register('pie', (cfg:GraphCfg, sName:string, dims: PolarSeriesDimensions) => new Pie(cfg, sName, dims));

export class Pie extends SeriesPlotPolar {
    constructor(cfg:GraphCfg, seriesName:string, dims:PolarSeriesDimensions) {
        super(cfg, seriesName, dims);
        this.abscissa = 'rad';
    }

    getDefaults(): PolarPlotDefaults {
        const def = <PolarPlotDefaults>super.getDefaults();
        def.area.rendered   = false;
        def.marker.rendered = true;
        def.line.rendered   = false;
        def.cornerRadius    = 0;
        def.padAngle        = 0;
        return def;
    } 

    protected markerShape():string {
        return 'path';
    }

    protected d3RenderMarkers(plot:d3Base, data:DataSet) {
        const defaults = this.defaults;
        if (defaults.marker.rendered) {
            const popup = this.cfg.components.popup;
            const shape = this.markerShape();
            const phiAccess = this.accessor(this.dims.phi, data.colNames, false);
            const pie = d3Pie().value((d:any, i:number) => <number>phiAccess(d, i));
            plot.select('.markers').selectAll(shape)
                .data(pie(<any>data.rows), (d:any) => d.data[3]) // bind to first DataVal, rather than to DataRow, iterate over rows
                .join(shape)                  
                .call(popup.addListener.bind(popup), this.d3RenderPopup(data))
                .transition(this.cfg.transition) // draw markers
                .call(this.d3DrawMarker.bind(this), data, defaults)
                .call(this.d3MarkerColors.bind(this), data, defaults);
        }
    }

    /** no line for pies. */
    protected d3RenderLine(plot:d3Base, data:DataSet) {}

    /** no fill for pies. */
    protected d3RenderFill(plot:d3Base, data:DataSet) {}


    protected d3RenderLabels(plot:d3Base, data:DataSet):void {
        const defaults = this.defaults;
        const popup = this.cfg.components.popup;
        if (defaults.label.rendered) {
            const phiAccess = this.accessor(this.dims.phi, data.colNames, false);
            const pie = d3Pie().value((d:any, i:number) => <number>phiAccess(d, i));
            const arcs = pie(<any>data.rows);
            plot.select('.label').selectAll('text')
                .data(arcs, d => d[0]) // bind to first DataVal, rather than to DataRow, iterate over rows
                .join('text')              
                .call(popup.addListener.bind(popup), this.d3RenderPopup(data))
                .transition(this.cfg.transition) // draw markers
                .call(this.d3DrawLabels.bind(this), data, defaults);
        }
    }
    

    protected d3DrawMarker(markers:d3Base, data:DataSet, defaults:PolarPlotDefaults):void {
        const scales = this.cfg.components.scales.scaleDims;
        const rAccess = this.accessor(this.dims.r, data.colNames, false);
        const r0Access = this.accessor(this.dims.r0, data.colNames, false);
        const arc = d3Arc()
            .padAngle(defaults.padAngle)
            .cornerRadius(defaults.cornerRadius)
            .innerRadius((d:any, i:number) => scales.rad(r0Access(d.data, i)))
            .outerRadius((d:any, i:number) => scales.rad(rAccess(d.data, i)));
        markers.attr("d", arc);
    }

    protected d3DrawLabels(labels:d3Base, data:DataSet, defaults:PolarPlotDefaults):void {
        const scales = this.cfg.components.scales.scaleDims;
        const rAccess = this.accessor(this.dims.r, data.colNames, false);
        const r0Access = this.accessor(this.dims.r0, data.colNames, false);
        const lAccess = this.accessor(this.dims.label, data.colNames, false);
        const centroid = (d:any, i:number, pos:number) => {
            const r = scales.rad(rAccess(d.data, i))*pos + scales.rad(r0Access(d.data, i))*(1-pos);
            const a = (d.startAngle + d.endAngle) / 2 - Math.PI / 2;
            return [Math.cos(a) * r, Math.sin(a) * r];
        };
        const cfg:Label = this.defaults.label;
        const pos = textPos(cfg.xpos, cfg.ypos, cfg.inside);
        labels.attr("transform", (d:any, i:number) => `translate(${centroid(d, i, pos.x.pos)})`)
              .text((d:any, i:number) => text(lAccess(d.data, i)))
              .attr('text-anchor', pos.x.anchor)
              .attr('dominant-baseline', pos.y.baseline)
              .attr('dx', ((cfg.hOffset||0)+pos.x.shift).toFixed(1) + 'em')
              .attr('dy', ((cfg.vOffset||0)+pos.y.shift).toFixed(1) + 'em');
    }

    protected getPath(rows:DataRow[], colNames:string[], yDef?: ValueDef, useStack?:boolean):string {
        return '';
    }
}
 
 