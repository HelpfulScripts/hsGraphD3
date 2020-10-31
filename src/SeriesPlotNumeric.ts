/**
 * # SeriesPlotNumeric
 * 
 * Abstract base class for all numeric series plot types, i.e. plots with numeric coordinates
 * To create a series plot, add the desired plot type to the graph:
 * ```
 * graph.add(<type>, {<dim>: <ValueDef>, ...});
 * ``` 
 * - `<type>` is one of the registered types: 
 *     - &nbsp; {@link plots.Line `line`} a 2D line plot
 *     - &nbsp; {@link plots.Bubble `bubble`} a 2D scatter plot with marker sizes driven by the data
 *     - &nbsp; {@link plots.Area `area`} a 2D area plot filling to the x-axis
 *     - &nbsp; {@link plots.TimeSeries `timeseries`} a 2D scatter plot with marker sizes driven by the data
 *     - &nbsp; {@link plots.Voronoi `voronoi`} a voronoi diagrom with centroids and partition
 * - `<dim>` is the semantic dimension to set. See {@link CartSeriesPlot.CartSeriesDimensions CartSeriesDimensions} for valid dimensions. 
 * - `<ValueDef>` is the {@link SeriesPlot.ValueDef value definition}. 
 */

/** */
import { Log }                  from 'hsutil'; const log = new Log('SeriesPlotNumeric');
import { line as d3line}        from 'd3';
import { curveCatmullRom, curveLinear, curveStepAfter }      
                                from 'd3';
import { NumericDataSet }       from './Graph';
import { DataSet }              from './Graph';
import { NumericDataRow }       from './Graph';
import { ValueDef, text }       from './SeriesPlot';
import { SeriesPlotDefaults }   from './SeriesPlot';
import { d3Base }               from './Settings';
import { Label }                from './Settings';
import { textPos }              from './Settings';
import { SeriesPlotCartesian }       from './SeriesPlotCartesian';

const curves = {
    catmull05:  curveCatmullRom.alpha(0.5),
    linear:     curveLinear,
    stepAfter:  curveStepAfter
}

/**
 * Abstract base class of a  cartesian series plot. 
 */
export abstract class SeriesPlotNumeric extends SeriesPlotCartesian { 

    //---------- lifecylce methods --------------------

    initialize(plot:d3Base, color?:string): void {
        super.initialize(plot, color);
    }

    preRender(data:NumericDataSet): void {
        super.preRender(data);
        const defaults = this.defaults;
        if (defaults.area.rendered && this.dims.y0===undefined) { 
            this.dims.y0 = this.dims.stacked? this.dims.stacked : ()=>0; 
        } 
    }

    //---------- support methods during lifecylce --------------------

    protected markerShape() { return 'circle'; }

    protected d3RenderFill(plot:d3Base, data:NumericDataSet) {
        // const scales = this.cfg.components.scales.scaleDims;
        let line = this.line = this.line || this.getPath(data.rows, data.colNames, this.dims.y);
        if (this.dims.y0!==undefined) {
            line += `L` + this.getPath(data.rows.reverse(), data.colNames, this.dims.y0, false).slice(1); // replace first 'M' with 'L'
        }
        return this.getPathElement(plot, '.area').attr('d', (d:any) => line);
    }


    //-------------------

    protected d3DrawMarker(markers:d3Base, data:DataSet, defaults:SeriesPlotDefaults) {
        const scales = this.cfg.components.scales.scaleDims;
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
        const scales = this.cfg.components.scales.scaleDims;
        const xAccess = this.accessor(this.dims.x, data.colNames);
        const yAccess = this.accessor(this.dims.y, data.colNames);
        const rAccess = this.accessor(this.dims.r, data.colNames, false);
        const rDefault = this.defaults.marker.size;
        const lAccess = this.accessor(this.dims.label, data.colNames, false);
        const cfg:Label = this.defaults.label;

        // const [xpos, ypos, yShift] = this.labelPos(cfg, labels);
        const pos = textPos(cfg.xpos, cfg.ypos, cfg.inside);
        labels
            .attr("x", (d:number[], i:number) => scales.hor(xAccess(d, i))
                + (this.dims.r? scales.size(rAccess(d, i)) : rDefault) * (pos.x.pos-0.5)*2)
            .attr("y", (d:number[], i:number) => scales.ver(yAccess(d, i)) 
                + (this.dims.r? scales.size(rAccess(d, i)) : rDefault) * (pos.y.pos-0.5)*2)
            .text((d:number[], i:number) => text(lAccess(d, i)))
            .attr('text-anchor', pos.x.anchor)
            .attr('dominant-baseline', pos.y.baseline)
            .attr('dx', ((cfg.hOffset||0)+pos.x.shift*0.4).toFixed(1) + 'em')
            .attr('dy', ((cfg.vOffset||0)+pos.y.shift*0.2).toFixed(1) + 'em');
    }
    
    /**
     * returns the path rendering for the main data line 
     * @param rows the data rows set to render from
     * @param yDef a constant (defaults to 0), or the data column to render from
     */
    protected getPath(rows:NumericDataRow[], colNames:string[], yDef: ValueDef = () => 0, useStack=true):string {
        const smooth = this.defaults.line.smoothing;
        const scales = this.cfg.components.scales.scaleDims;
        const xAccess = this.accessor(this.dims.x, colNames, useStack);
        const yAccess = this.accessor(yDef, colNames, useStack);
        const line = d3line()
            .x((d:number[], i:number) => scales.hor(xAccess(d, i)))
            .y((d:number[], i:number) => scales.ver(yAccess(d, i)))
            .curve(curves[smooth]);
        return line(<[number, number][]>rows);
    }
}

