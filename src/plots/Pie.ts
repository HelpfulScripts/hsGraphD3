/**
 * # Pie Plot
 * 
 * plots a 2D pie chart. 
 * 
 * ## Usage
 * `graph.series.add('pie', {phi:<angle-col>, ...<dim>:<ValueDef>});`
 * - `<dim>` is the semantic dimension to set. See {@link PolarSeriesPlot.PolarSeriesDimensions PolarSeriesDimensions} for valid dimensions. 
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
 * const graph = new hsGraphD3.GraphPolar(root);
 * graph.series.add('pie', {phi:'costs', label:'date'});
 * graph.defaults.series.series0.marker.stroke.color = '#fff';
 * graph.defaults.series.series0.label.xpos = 0.8;
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
 * const graph = new hsGraphD3.GraphPolar(root);
 * // omitting 'phi' defaults to phi=1
 * graph.series.add('pie', {r:'costs', r0:0.1, label:'date'});
 * graph.defaults.series.series0.marker.stroke.color = '#fff';
 * graph.defaults.series.series0.label.xpos = 0.8;
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
 *      const graph = new hsGraphD3.GraphPolar(svgRoot);
 *      graph.series.add('pie', {phi:'volume'});
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
import { PolarSeriesPlot }      from '../PolarSeriesPlot';
import { PolarPlotDefaults }    from '../PolarSeriesPlot';
import { PolarSeriesDimensions }from '../PolarSeriesPlot';
import { Label, d3Base, TextHAlign }        from '../Settings';
import { DataRow, DataSet }     from '../Graph';
import { pie as d3Pie }         from 'd3';
import { arc as d3Arc }         from 'd3';
 
Series.register('pie', (cfg:GraphCfg, sName:string, dims: PolarSeriesDimensions) => new Pie(cfg, sName, dims));

export class Pie extends PolarSeriesPlot {
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
            const popup = this.cfg.graph.popup;
            const shape = this.markerShape();
            const phiAccess = this.accessor(this.dims.phi, data.colNames, false);
            const pie = d3Pie().value((d:any, i:number) => <number>phiAccess(d, i));
            const arcs = pie(<any>data.rows);
            plot.select('.markers').selectAll(shape)
                .data(arcs, d => d[0]) // bind to first DataVal, rather than to DataRow, iterate over rows
                .join(shape)                  
                .call(popup.addListener.bind(popup), this.d3RenderPopup(data))
                .transition(this.cfg.transition) // draw markers
                .call(this.d3DrawMarker.bind(this), data, defaults)
                .call(this.d3MarkerColors.bind(this), data, defaults);
        }
    }

    protected d3RenderLine(plot:d3Base, data:DataSet) {
        this.line = this.line || this.getPath(data.rows, data.colNames, this.dims.r);
        return this.getPathElement(plot, '.line').attr('d', (d:any) => this.line);
    }

    protected d3RenderLabels(plot:d3Base, data:DataSet):void {
        const defaults = this.defaults;
        const popup = this.cfg.graph.popup;
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
        const scales = this.cfg.graph.scales.scaleDims;
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
        const scales = this.cfg.graph.scales.scaleDims;
        const rAccess = this.accessor(this.dims.r, data.colNames, false);
        const r0Access = this.accessor(this.dims.r0, data.colNames, false);
        const lAccess = this.accessor(this.dims.label, data.colNames, false);
        const centroid = (d:any, i:number, pos:number) => {
            const r = scales.rad(rAccess(d.data, i))*pos + scales.rad(r0Access(d.data, i))*(1-pos);
            const a = (d.startAngle + d.endAngle) / 2 - Math.PI / 2;
            return [Math.cos(a) * r, Math.sin(a) * r];
        };
        const cfg:Label = this.defaults.label;
        const [xpos, ypos] = this.labelPos(cfg, labels);
        labels.attr("transform", (d:any, i:number) => `translate(${centroid(d, i, xpos)})`)
              .text((d:any, i:number) => text(lAccess(d.data, i)));
    }

    protected getPath(rows:DataRow[], colNames:string[], yDef?: ValueDef, useStack?:boolean):string {
        return '';
    }

    protected labelPos(cfg:Label, labels:d3Base) {
        let xShift = 0;
        let yShift = 0.35;
        let xpos = +cfg.xpos;
        let ypos = 0.5;     // 0: top of bar, 1: bottom of bar
        let anchor = 'middle';
        switch(cfg.xpos) {
            case TextHAlign.left:   xpos = 0; break;
            case TextHAlign.center: xpos = 0.5; break;
            case TextHAlign.right:  xpos = 1; break; 
            default: break;
        }
        labels.style('text-anchor', anchor)
              .attr('dx', ((cfg.hOffset||0)+xShift).toFixed(1) + 'em')
              .attr('dy', ((cfg.vOffset||0)+yShift).toFixed(1) + 'em');
    return [xpos, ypos];
    }
}
 
 