/**
 * # NumericSeriesPlot
 * 
 * Abstract base class for all numeric series plot types.
 * To create a series plot, add the desired plot type to the graph:
 * ```
 * graph.series.add(<type>, {<dim>: <data-values>, ...});
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
 * - `<data-values>` is the value to use for the {@link Series.SeriesDimensions semantic dimension}. Values may be specified
 *     - by `string` to specify the column name of the data set to use
 *     - by `number` to specify a constant value to use.  
 */

/** */
import { Log }                  from 'hsutil'; const log = new Log('NumericSeriesPlot');
import { line as d3line}        from "d3";
import { curveCatmullRom }      from 'd3';
import { NumericDataSet }       from '../Graph';
import { NumericDataRow }       from '../Graph';
import { ValueDef }             from '../Graph';
import { Domains }              from '../Graph';
import { d3Base }               from '../Settings';
import { CartSeriesPlot }       from '../CartSeriesPlot';



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
        if (defaults.area.rendered && this.dims.y0===undefined) { this.dims.y0 = ()=>0; } 
        this.line = undefined;
    }

    //---------- support methods during lifecylce --------------------

    protected d3RenderMarkers(svg:d3Base, data:NumericDataSet) {
        const defaults = this.defaults.marker;
        if (defaults.rendered) {
            const samples:any = svg.select('.markers').selectAll("circle")
                .data(data.rows, d => d[0]);                // bind to data, iterate over rows
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
        let line0 = '';
        if (this.dims.y0!==undefined) {
            const max = data.rows.length-1;
            const xmax = scales.hor(this.accessor(this.dims.x,  data.colNames)(data.rows[max]));
            const x0   = scales.hor(this.accessor(this.dims.x,  data.colNames)(data.rows[0]));
            const y    = scales.ver(this.accessor(this.dims.y0, data.colNames)(data.rows[max]));
            line0 = `L${xmax},${y}`;
            line0 += (typeof(this.dims.y0)==='function')? `L${x0},${y}` :
                this.getLine(data.rows.reverse(), data.colNames, this.dims.y0).slice(8);  // remove first 'M' command
        }
        return this.getPathElement(svg, '.area').attr('d', (d:any) => this.line + line0);
    }

    protected d3RenderLabels(svg:d3Base, data:NumericDataSet):void {
    }

    protected d3RenderPopup(svg:d3Base, data:NumericDataSet):void {
    }

    protected d3DrawMarker(markers:d3Base, colNames:string[]) {
        const scales = this.cfg.graph.scales.scaleDims;
        const xAccess = this.accessor(this.dims.x, colNames);
        const yAccess = this.accessor(this.dims.y, colNames);
        const rAccess = this.accessor(this.dims.r, colNames);
        const rDefault = this.defaults.marker.size;
        markers
            .attr("cx", (d:number[]) => scales.hor(xAccess(d)))
            .attr("cy", (d:number[]) => scales.ver(yAccess(d)))
            .attr("r",  (d:number[]) => this.dims.r? scales.size(rAccess(d)) : rDefault);
    }
    
    /**
     * returns the path rendering for the main data line 
     * @param data the data set to render from
     * @param yDef a constant (defaults to 0), or the data column to render from
     */
    protected getLine(rows:NumericDataRow[], colNames:string[], yDef: ValueDef = () => 0):string {
        const scales = this.cfg.graph.scales.scaleDims;
        const xAccess = this.accessor(this.dims.x, colNames);
        const yAccess = this.accessor(yDef, colNames);
        const line = d3line()
            .x((d:number[]) => scales.hor(xAccess(d)))
            .y((d:number[]) => scales.ver(yAccess(d)))
            .curve(curveCatmullRom.alpha(0.2));
        return line(<[number, number][]>rows);
    }
}

