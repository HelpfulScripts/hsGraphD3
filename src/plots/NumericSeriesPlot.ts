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
import { NumericDataSet }       from '../Graph';
import { DataSet }              from '../Graph';
import { NumericDataRow }       from '../Graph';
import { ValueDef, text }       from '../SeriesPlot';
import { SeriesPlotDefaults }   from '../SeriesPlot';
import { Domains }              from '../Graph';
import { d3Base, Label }        from '../Settings';
import { CartSeriesPlot }       from '../CartSeriesPlot';
import { TextHAlign }           from "../Settings";
import { TextVAlign }           from "../Settings";


/**
 * Abstract base class of a  cartesian series plot. 
 */
export abstract class NumericSeriesPlot extends CartSeriesPlot { 

    //---------- lifecylce methods --------------------

    initialize(plot:d3Base, color?:string): void {
        super.initialize(plot, color);
    }

    preRender(data:NumericDataSet, domains:Domains): void {
        super.preRender(data, domains);
        const defaults = this.defaults;
        if (defaults.area.rendered && this.dims.y0===undefined) { 
            this.dims.y0 = this.dims.stacked? this.dims.stacked : ()=>0; 
        } 
    }

    //---------- support methods during lifecylce --------------------

    protected markerShape() { return 'circle'; }

    protected d3RenderFill(plot:d3Base, data:NumericDataSet) {
        const scales = this.cfg.graph.scales.scaleDims;
        let line = this.line = this.line || this.getPath(data.rows, data.colNames, this.dims.y);
        if (this.dims.y0!==undefined) {
            line += `L` + this.getPath(data.rows.reverse(), data.colNames, this.dims.y0, false).slice(1); // replace first 'M' with 'L'
        }
        return this.getPathElement(plot, '.area').attr('d', (d:any) => line);
    }


    //-------------------

    protected d3DrawMarker(markers:d3Base, data:DataSet, defaults:SeriesPlotDefaults) {
        const scales = this.cfg.graph.scales.scaleDims;
        const xAccess = this.accessor(this.dims.x, data.colNames);
        const yAccess = this.accessor(this.dims.y, data.colNames);
        // don't scale markers as 'stacked markers' -> use super instead of this:
        const rAccess = this.accessor(this.dims.r, data.colNames, false);
        const rDefault = this.defaults.marker.size;
        markers
            .attr("cx", (d:number[], i:number) => scales.hor(xAccess(d, i)))
            .attr("cy", (d:number[], i:number) => scales.ver(yAccess(d, i)))
            .attr("r",  (d:number[], i:number) => this.dims.r? scales.size(rAccess(d, i)) : rDefault);
    }
    
    protected d3DrawLabels(labels:d3Base, data:DataSet, defaults:SeriesPlotDefaults) {
        const scales = this.cfg.graph.scales.scaleDims;
        const xAccess = this.accessor(this.dims.x, data.colNames);
        const yAccess = this.accessor(this.dims.y, data.colNames);
        const rAccess = this.accessor(this.dims.r, data.colNames, false);
        const rDefault = this.defaults.marker.size;
        const lAccess = this.accessor(this.dims.label, data.colNames, false);
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
    protected getPath(rows:NumericDataRow[], colNames:string[], yDef: ValueDef = () => 0, useStack=true):string {
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

