/**
 * # NumericSeriesPlot
 * 
 * Abstract base class for all numeric series plot types.
 * To create a series plot, add the desired plot type to the graph:
 * ```
 * graph.addSeries(<type>, {<dim>: <data-values>, ...});
 * ``` 
 * - `<type>` is one of the registered types: 
 *     - &nbsp; {@link plots.Line `line`} a 2D line plot
 *     - &nbsp; {@link plots.Bubble `bubble`} a 2D scatter plot with marker sizes driven by the data
 *     - &nbsp; {@link plots.Area `area`} a 2D area plot filling to the x-axis
 *     - &nbsp; {@link plots.Band `band`} a 2D area plot filling between 2 series 
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
import { log as gLog }          from 'hsutil';   const log = gLog('SeriesPlot');
import { line as d3line}        from "d3";
import { curveCatmullRom }      from 'd3';
import { NumericDataSet }       from './Graph';
import { NumericDataRow }       from './Graph';
import { NumberSet }            from './Graph';
import { Domains }              from './Graph';
import { NumberScale }          from './GraphComponent';
import { d3Base }               from './Settings';
import { CartSeriesPlot }       from './CartSeriesPlot';
import { SeriesPlotDefaults }   from './SeriesPlot';

/** */
function accessor(v:NumberSet, colNames:string[], scale:NumberScale) {
    return (d:number[]) => scale(typeof(v)==='number'? v : d[colNames.indexOf(v)]);
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
        const defaults = (<SeriesPlotDefaults>this.cfg.defaults.series[this.key]);
        if (defaults.area.rendered && this.dims.y0===undefined) { this.dims.y0 = 0; } 
        this.line = undefined;
    }


    //---------- support methods during lifecylce --------------------

    protected d3RenderMarkers(svg:d3Base, data:NumericDataSet) {
        const defaults = (<SeriesPlotDefaults>this.cfg.defaults.series[this.key]).marker;
        if (defaults.rendered) {
            const samples:any = svg.select('.markers').selectAll("circle")
                .data(data.rows, d => d[0]);                // bind to data, iterate over rows
            samples.exit().remove();                        // remove unneeded circles
            samples.enter().append('circle')                // add new circles
                .call(this.d3DrawMarker, this, data.colNames)
            .merge(samples).transition(this.cfg.transition) // draw markers
                .call(this.d3DrawMarker, this, data.colNames);
        }
    }

    protected d3RenderPath(svg:d3Base, data:NumericDataSet) {
        this.line = this.line || this.getLine(data.rows, data.colNames, this.dims.y);
        return this.getPathElement(svg, '.line').attr('d', (d:any) => this.line);
    }

    protected d3RenderFill(svg:d3Base, data:NumericDataSet) {
        this.line = this.line || this.getLine(data.rows, data.colNames, this.dims.y);
        let line0 = '';
        if (this.dims.y0!==undefined) {
            const max = data.rows.length-1;
            const xmax = accessor(this.dims.x, data.colNames, this.cfg.scales.hor)(data.rows[max]);
            const x0   = accessor(this.dims.x, data.colNames, this.cfg.scales.hor)(data.rows[0]);
            const y    = accessor(this.dims.y0, data.colNames, this.cfg.scales.ver)(data.rows[max]);
            line0 = `L${xmax},${y}`;
            line0 += (typeof(this.dims.y0)==='number')? `L${x0},${y}` :
                this.getLine(data.rows.reverse(), data.colNames, this.dims.y0).slice(8);  // remove first 'M' command
        }
        return this.getPathElement(svg, '.area').attr('d', (d:any) => this.line + line0);
    }

    protected d3DrawMarker(markers:d3Base, plot:NumericSeriesPlot, colNames:string[]) {
        markers
            .attr("cx", (d:number[]) => accessor(plot.dims.x, colNames, plot.cfg.scales.hor)(d))
            .attr("cy", (d:number[]) => accessor(plot.dims.y, colNames, plot.cfg.scales.ver)(d))
            .attr("r",  (d:number[]) => (plot.dims.r!==undefined)? 
                                        accessor(plot.dims.r, colNames, plot.cfg.scales.size)(d)
                                      : plot.cfg.defaults.series[plot.key].marker.size);
    }
    
    /**
     * returns the path rendering for the main data line 
     * @param data the data set to render from
     * @param yCol a constant (defaults to 0), or the data column to render from
     */
    protected getLine(rows:NumericDataRow[], colNames:string[], yCol: NumberSet = 0):string {
        const line = d3line()
            .x(accessor(this.dims.x, colNames, this.cfg.scales.hor))
            .y(accessor(yCol, colNames, this.cfg.scales.ver))
            .curve(curveCatmullRom.alpha(0.2));
        return line(<[number, number][]>rows);
    }

    protected getPathElement(svg:d3Base, cls:string):any {
        return svg.select(cls).selectAll('path').transition(this.cfg.transition);
    }
}

