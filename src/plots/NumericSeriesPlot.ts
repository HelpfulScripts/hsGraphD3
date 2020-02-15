/**
 * # NumericSeriesPlot
 * 
 * Abstract base class for all numeric series plot types.
 * To create a series plot, add the desired plot type to the graph:
 * ```
 * graph.series.add(<type>, {<dim>: <ValueDef>, ...});
 * ``` 
 * - `<type>` is one of the registered types: 
 *     - &nbsp; {@link plots.Line `line`} a 2D line plot
 *     - &nbsp; {@link plots.Bubble `bubble`} a 2D scatter plot with marker sizes driven by the data
 *     - &nbsp; {@link plots.Area `area`} a 2D area plot filling to the x-axis
 *     - &nbsp; {@link plots.TimeSeries `timeseries`} a 2D scatter plot with marker sizes driven by the data
 *     - &nbsp; {@link plots.Voronoi `voronoi`} a voronoi diagrom with centroids and partition
 * - `<dim>` is one of the semantic dimensions defined for the plot. `NumericSeriesPlots` define the 
 *   following dimensions:
 *     - `x`: required; the value to plot along the x-axis
 *     - `y`: required; the value to plot along the y-axis
 *     - `y0`: optional; for areas, the lower bound of the area. 
 *       Specifying a value for `y0` will automatically enable area rendering
 *     - `r`: optional; for markers, the value to use for the size
 *       Specifying a value for `r` will automatically enable markers
 * - `<ValueDef>` is the value to use for the {@link Series.SeriesDimensions semantic dimension}. Values may be specified
 *     - by `string` to specify the column name of the data set to use
 *     - by `number` to specify a constant value to use.  
 */

/** */
import { Log }                  from 'hsutil'; const log = new Log('NumericSeriesPlot');
import { line as d3line}        from 'd3';
import { curveCatmullRom }      from 'd3';
import { NumericDataSet, DataRow, DataVal, DataSet, NumDomain }       from '../Graph';
import { NumericDataRow }       from '../Graph';
import { ValueDef }             from '../SeriesPlot';
import { Domains }              from '../Graph';
import { d3Base, Label }        from '../Settings';
import { CartSeriesPlot, text } from '../CartSeriesPlot';
import { TextHAlign }           from "../Settings";
import { TextVAlign }           from "../Settings";

interface AccessorFn {
    (v:ValueDef, colNames:string[]):(row:DataRow, rowIndex:number) => DataVal;
}

/**
 * Abstract base class of a  cartesian series plot. 
 */
export abstract class NumericSeriesPlot extends CartSeriesPlot { 
    /** the main data line  */
    protected line: string;         // d3Line<number[]>;


    //---------- lifecylce methods --------------------

    initialize(svg:d3Base, color?:string): void {
        super.initialize(svg, color);
    }

    preRender(data:NumericDataSet, domains:Domains): void {
        super.preRender(data, domains);
        const defaults = this.defaults;
        if (defaults.area.rendered && this.dims.y0===undefined) { 
            this.dims.y0 = this.dims.stacked? this.dims.stacked : ()=>0; 
        } 
        this.line = undefined;
    }

    //---------- support methods during lifecylce --------------------

    protected d3RenderMarkers(svg:d3Base, data:NumericDataSet) {
        const defaults = this.defaults.marker;
        if (defaults.rendered) {
            const samples:any = svg.select('.markers').selectAll("circle")
                .data(data.rows, (d:any[]) => d[0]);        // bind to data, iterate over rows
            samples.exit().remove();                        // remove unneeded circles
            samples.enter().append('circle')                // add new circles
                .call(this.d3DrawMarker.bind(this), data.colNames)
            .merge(samples).transition(this.cfg.transition) // draw markers
                .call(this.d3DrawMarker.bind(this), data.colNames);
        }
    }

    protected d3RenderPath(svg:d3Base, data:NumericDataSet) {
        this.line = this.line || this.getLine(data.rows, data.colNames, this.dims.y);
        return this.getPathElement(svg, '.line').attr('d', (d:any) => this.line);
    }

    protected d3RenderFill(svg:d3Base, data:NumericDataSet) {
        const scales = this.cfg.graph.scales.scaleDims;
        this.line = this.line || this.getLine(data.rows, data.colNames, this.dims.y);
        if (this.dims.y0!==undefined) {
            const max = data.rows.length-1;
            const xmax = scales.hor(this.accessor(this.dims.x,  data.colNames, false)(data.rows[max], 0));
            const y0   = scales.ver(this.accessor(this.dims.y0, data.colNames, false)(data.rows[max], 0));
            // extend end of line down to base:
            this.line += `L${xmax},${y0}`
                + this.getLine(data.rows.reverse(), data.colNames, this.dims.y0, false).slice(8);  // remove first 'M' command
            }
        return this.getPathElement(svg, '.area').attr('d', (d:any) => this.line);
    }

    protected d3RenderLabels(labels:d3Base, data:NumericDataSet):void {
        const defaults = this.defaults.label;
        if (defaults.rendered) {
            const samples:any = labels.select('.label').selectAll("text")
                .data(data.rows, (d:any[]) => d[0]);                // bind to data, iterate over rows
            samples.exit().remove();                        // remove unneeded circles
            samples.enter().append('text')                // add new circles
                .call(this.d3DrawLabels.bind(this), data.colNames)
            .merge(samples).transition(this.cfg.transition) // draw markers
                .call(this.d3DrawLabels.bind(this), data.colNames);
        }
    }

    protected d3RenderPopup(svg:d3Base, data:NumericDataSet):void {
    }

    //-------------------

    protected d3DrawMarker(markers:d3Base, colNames:string[]) {
        const scales = this.cfg.graph.scales.scaleDims;
        const xAccess = this.accessor(this.dims.x, colNames);
        const yAccess = this.accessor(this.dims.y, colNames);
        // don't scale markers as 'stacked markers' -> use super instead of this:
        const rAccess = this.accessor(this.dims.r, colNames, false);
        const rDefault = this.defaults.marker.size;
        markers
            .attr("cx", (d:number[], i:number) => scales.hor(xAccess(d, i)))
            .attr("cy", (d:number[], i:number) => scales.ver(yAccess(d, i)))
            .attr("r",  (d:number[], i:number) => this.dims.r? scales.size(rAccess(d, i)) : rDefault);
    }
    
    protected d3DrawLabels(labels:d3Base, colNames:string[]) {
        const scales = this.cfg.graph.scales.scaleDims;
        const xAccess = this.accessor(this.dims.x, colNames);
        const yAccess = this.accessor(this.dims.y, colNames);
        const rAccess = this.accessor(this.dims.r, colNames, false);
        const rDefault = this.defaults.marker.size;
        const lAccess = this.accessor(this.dims.label, colNames, false);
        const cfg:Label = this.defaults.label;

        const [xpos, ypos, yShift] = this.labelPos(cfg, labels);
        labels
            .attr("x", (d:number[], i:number) => scales.hor(xAccess(d, i))
                + (this.dims.r? scales.size(rAccess(d, i)) : rDefault) * xpos)
            .attr("y", (d:number[], i:number) => scales.ver(yAccess(d, i)) 
                + (this.dims.r? scales.size(rAccess(d, i)) : rDefault) * ypos)
            .text((d:number[], i:number) => text(lAccess(d, i)));
        }
    
    /**
     * returns the path rendering for the main data line 
     * @param rows the data rows set to render from
     * @param yDef a constant (defaults to 0), or the data column to render from
     */
    protected getLine(rows:NumericDataRow[], colNames:string[], yDef: ValueDef = () => 0, useStack=true):string {
        const scales = this.cfg.graph.scales.scaleDims;
        const xAccess = this.accessor(this.dims.x, colNames, useStack);
        const yAccess = this.accessor(yDef, colNames, useStack);
        const line = d3line()
            .x((d:number[], i:number) => scales.hor(xAccess(d, i)))
            .y((d:number[], i:number) => scales.ver(yAccess(d, i)))
            .curve(curveCatmullRom.alpha(0.2));
        return line(<[number, number][]>rows);
    }

    protected labelPos(cfg:Label, labels:d3Base) {
        let xShift = 0;
        let yShift = 0.35;
        let xpos = 0;   // 0: left aligned, 1: right aligned
        let ypos = 0;   // 0: top of bar, 1: bottom of bar
        let anchor = 'middle';
        switch(cfg.xpos) { 
            case TextHAlign.left:   xpos = -1; xShift = -0.4; anchor = 'end'; break;
            case TextHAlign.center: break;
            case TextHAlign.right:  xpos = 1;  xShift = +0.4; anchor = 'start';  break;
            default: log.warn(`illegal TextHAlign: ${cfg.xpos}`);
        }
        switch(cfg.ypos) { // additional y 'em' shift
            case TextVAlign.top:    ypos = -1; yShift = -0.4; break;
            case TextVAlign.center: break;
            case TextVAlign.bottom: ypos = 1;  yShift = 1.0;  break;
            default:  log.warn(`illegal TextVAlign: ${cfg.ypos}`);
        }
        labels.style('text-anchor', anchor)
              .attr('dx', ((cfg.hOffset||0)+xShift).toFixed(1) + 'em')
              .attr('dy', ((cfg.vOffset||0)+yShift).toFixed(1) + 'em');
    return [xpos, ypos];
    }
}



/*
M 20, 290
C 20, 290, 411, 210.23179932478553, 501, 230
C 571.2603178095034, 245.51221789224996, 553.1221813226826, 341.8434073724211, 581, 350
C 606.9505221479196, 357.59269726529084, 634.7137297362991, 305.08822154160134, 662, 290
C 688.3987168157074, 275.4025601930922, 715.3333333333334, 260, 742, 260
C 768.6666666666665, 260, 822, 290, 822, 290
L 822, 350
C 822, 350, 768.6666666666667, 350, 742, 350
C 715.3333333333333, 350, 688.7996687334819, 350.00000000000006, 662, 350
C 635.1336645998521, 350.00000000000006, 607.866335400148, 350.00000000000006, 581, 350
C 554.2003312665181, 350.00000000000006, 562.7601121189196, 349.99999999999994, 501, 350
C 412.58639608911926, 350, 20, 350, 20, 350


M 20, 200
C 20, 200, 410, -1, 501, 20
C 579, 38, 550.5655480909484, 231.14429747195726, 581, 260
C 605.5486261218074, 283.27519664095996, 636.3908587365714, 252.38263253416818, 662, 230
C 690.374070616791, 205.2007929675835, 714.2831132677925, 118.11427386560845, 742, 110
C 767., 102., 822, 170, 822, 170
L 822, 230
C 822, 290, 768, 260, 742, 260
C 715.3333333333334, 260, 688.3987168157074, 275.4025601930922, 662, 290
C 634.7137297362991, 305.08822154160134, 606.9505221479196, 357.5926972652908, 581, 350
C 553.1221813226826, 341.84340737242115, 571.2603178095034, 245.51221789225, 501, 230
C 411.46283183937743, 210.23179932478556, 20, 290, 20, 290
*/