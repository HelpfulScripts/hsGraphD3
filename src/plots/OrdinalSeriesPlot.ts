/**
 * # OrdinalSeriesPlot
 * 
 * Abstract base class for all ordinal series plot types.
 * To create a series plot, add the desired plot type to the graph:
 * ```
 * graph.addSeries(<type>, {<dim>: <data-values>, ...});
 * ``` 
 * - `<type>` is one of the registered types: 
 *     - &nbsp; {@link plots.Bar `bar`} a horizontal bar chart
 *     - &nbsp; {@link plots.Column `column`} a vertical column chart
 * - `<dim>` is one of the semantic dimensions defined for the plot. `NumericSeriesPlots` define the 
 *   following dimensions:
 *     - `x`: required; the value to plot along the x-axis
 *     - `y`: required; the value to plot along the y-axis
 * - `<data-values>` is the value to use for the {@link Series.SeriesDimensions semantic dimension}. Values may be specified
 *     - by `string` to specify the column name of the data set to use
 *     - by `number` to specify a constant value to use.  
 */

/** */
import { log as gLog }          from 'hsutil';   const log = gLog('OrdinalSeriesPlot');
import { NumericDataSet }       from '../Graph';
import { ValueFn }              from '../Graph';
import { DataSet }              from '../Graph';
import { ValueDef }             from '../Graph';
import { Domains }              from '../Graph';
import { Scale }                from '../Scale';
import { d3Base }               from '../Settings';
import { CartSeriesPlot }       from '../CartSeriesPlot';
import { SeriesPlotDefaults }   from '../SeriesPlot';


export interface OrdinalPlotDefaults extends SeriesPlotDefaults {
    /** gap width as a ration between 0 (no gap) and 1 (all gap). */
    gap:   number;  
}


/**
 * Returns a function to access the numeric value in a data row.
 * The numeric value is specified by the `ValueDef` `v`. 
 * - If `v` is a number, applies the `scale` to `v`, and returns the result.
 * - If `v` is contained in `colNames`, uses the position of `v` in `colNames` to index the 
 * supplied `row`, applies the `scale`, and returns the result.
 * - Otherwise, if `v` ends with 'u', interprets `v` to be Viewport Units and 
 * returns `v` without aplying `scale`. This allows for absolute positioning inside the 
 * viewport window.
 * @param v the `ValueDef` specifying the value
 * @param colNames a list of names for the coluymns in the `DataSet`
 * @param scale a numeric scale to apply 
 * @param def defaults to `0`; the default to return if `v` is `undefined`.
 */
export function accessor(v:ValueDef, colNames:string[], scale:Scale, def=0):(row?:number[], i?:number) => number {
    const index = colNames.indexOf(''+v);
    const fn = typeof(v)==='function';
    // const unit = (''+v).slice(-1);
    // if (index < 0 && unit === 'u') {}
    return v===undefined? 
        () => def :      // always return default
        (row?:number[], i?:number) => scale(fn? (<ValueFn>v)(i) : row[index]);
}


/**
 * Abstract base class of a  cartesian series plot. 
 */
export abstract class OrdinalSeriesPlot extends CartSeriesPlot { 

    getDefaults(): OrdinalPlotDefaults {
        const def = <OrdinalPlotDefaults>super.getDefaults();
        def.gap = 0.1;
        def.area.rendered = true;
        def.marker.rendered = false;
        def.line.rendered = false;
        return def;
    } 

    //---------- lifecylce methods --------------------

    initialize(svg:d3Base, color?:string): void {
        super.initialize(svg, color);
    }

    preRender(data:DataSet, domains:Domains): void {
        super.preRender(data, domains);
    }

    //---------- support methods during lifecylce --------------------

    protected d3RenderMarkers(svg:d3Base, data:NumericDataSet) {
    }

    protected d3RenderPath(svg:d3Base, data:NumericDataSet) {
    }

    protected d3RenderFill(svg:d3Base, data:DataSet) {
        const defaults = (<OrdinalPlotDefaults>this.cfg.defaults.series[this.key]).area;
        if (defaults.rendered) {
            const samples:any = svg.select('.area').selectAll("rect")
                .data(data.rows, d => d[0]);                // bind to data, iterate over rows
            samples.exit().remove();                        // remove unneeded rects
            samples.enter().append('rect')                  // add new rects
                .call(this.d3DrawBar.bind(this), this, data.colNames)
                .merge(samples).transition(this.cfg.transition) // draw markers
                .call(this.d3DrawBar.bind(this), this, data.colNames);
        }
    }

    protected abstract d3DrawBar(markers:d3Base, plot:OrdinalSeriesPlot, colNames:string[]):void;
}

