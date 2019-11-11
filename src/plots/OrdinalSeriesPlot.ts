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
 *     - `stacked`: optional, specifies a group name for which series values will be stacked.
 * - `<data-values>` is the value to use for the {@link Series.SeriesDimensions semantic dimension}. Values may be specified
 *     - by `string` to specify the column name of the data set to use
 *     - by `number` to specify a constant value to use.  
 */

/** */
import { log as gLog }          from 'hsutil';   const log = gLog('OrdinalSeriesPlot');
import { DataRow }              from '../Graph';
import { DataVal }              from '../Graph';
import { NumDomain }            from '../Graph';
import { ValueFn }              from '../Graph';
import { DataSet }              from '../Graph';
import { ValueDef }             from '../Graph';
import { Domains }              from '../Graph';
import { Scale, ScaleTypes }    from '../Scale';
import { d3Base }               from '../Settings';
import { CartSeriesPlot }       from '../CartSeriesPlot';
import { SeriesPlotDefaults }   from '../SeriesPlot';
import { SeriesDefaults }       from '../Series';
import { Series }               from '../Series';


export interface OrdinalPlotDefaults extends SeriesPlotDefaults {
    /** gap width as a ration between 0 (no gap) and 1 (all gap). */
    gap:   number;  

    /** overlap between multiple series, between 0 (no overlap) and 1 (complete overlap) */
    overlap: number;
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
export function accessor(v:ValueDef, colNames:string[], def=0):(row?:number[], i?:number) => ScaleTypes {
    const index = colNames.indexOf(''+v);
    const fn = typeof(v)==='function';
    return v===undefined? 
        () => def :      // always return default
        (row?:number[], i?:number) => fn? (<ValueFn>v)(i) : row[index];
}


/**
 * Abstract base class of a  cartesian series plot. 
 */
export abstract class OrdinalSeriesPlot extends CartSeriesPlot { 
    getDefaults(): OrdinalPlotDefaults {
        const def = <OrdinalPlotDefaults>super.getDefaults();
        def.area.rendered = true;
        def.marker.rendered = false;
        def.line.rendered = false;
        def.line.width = 1;
        this.cfg.defaults.scales.dims[this.independentAxis].type = 'ordinal';
        return def;
    } 

    value(dim:string, v:ValueDef, colNames:string[]):(row?:DataRow, i?:number) => ScaleTypes {
        const stackDim = this.independentAxis==='hor'? 'ver' : 'hor';
        if (this.dims.stacked && dim===stackDim) {
            const fn = typeof(v)==='function';
            const stack = this.cfg.stack[<string>this.dims.stacked];
            const index = colNames.indexOf(''+v);
            return (row, i) => stack[i] += <number>(fn? (<ValueFn>v)(i) : row[index]);    
        } else {
            return super.value(dim, v, colNames);
        }
    }

    /** ensures that 0 is in the domain, since the columns extend down to 0. */
    protected expandNumDomain(dataSet:DataSet, domain:NumDomain, fn:(row?:DataRow, i?:number) => ScaleTypes):NumDomain {
        domain = super.expandNumDomain(dataSet, domain, fn);
        domain[0] = Math.min(0, domain[0]);
        domain[1] = Math.max(0, domain[1]);
        return domain;
    }

    //---------- lifecylce methods --------------------

    initialize(svg:d3Base, color?:string): void {
        super.initialize(svg, color);
    }

    preRender(data:DataSet, domains:Domains): void {
        super.preRender(data, domains);
        const gap = (<SeriesDefaults>this.cfg.defaults.series).ordinal.gap;
        this.cfg.scales[this.independentAxis].padding(gap);
    }
 

    //---------- support methods during lifecylce --------------------

    protected d3RenderMarkers(svg:d3Base, data:DataSet) {
    }

    protected d3RenderPath(svg:d3Base, data:DataSet) {
        const line = this.getLine(this, data.rows, data.colNames);
        return this.getPathElement(svg, '.line').attr('d', (d:any) => line);
    }

    protected d3RenderFill(svg:d3Base, data:DataSet) {
        const defaults = (<OrdinalPlotDefaults>this.cfg.defaults.series[this.key]).area;
        if (defaults.rendered) {
            const samples:any = svg.select('.area').selectAll("rect")
                .data(data.rows, d => d[0]);                    // bind to data, iterate over rows
            samples.exit().remove();                            // remove unneeded rects
            samples.enter().append('rect')                      // add new rects
                .call(this.d3DrawBar.bind(this), this, data.colNames)
                .merge(samples).transition(this.cfg.transition) // draw markers
                .call(this.d3DrawBar.bind(this), this, data.colNames);
        }
    }
 
    private getParams(plot:OrdinalSeriesPlot, colNames:string[]):any[] {
        const stackGroup = plot.dims.stacked || false;
        const allKeys = Object.keys(plot.cfg.defaults.series).filter(k => k.indexOf(Series.type)===0);
        const myKey = allKeys.indexOf(plot.key) || 0;
        const step = plot.cfg.scales[plot.independentAxis].step();
        const pad = plot.cfg.scales[plot.independentAxis].padding();
        const overlap = plot.cfg.defaults.series.ordinal.overlap;
        const thickness = step * (1-pad) / (stackGroup? 1 : (allKeys.length * (1-overlap) + overlap));
        const offset = step*pad/2 + (stackGroup? 0 : thickness*myKey * (1-overlap));
        return [offset, thickness, stackGroup];
    }

    protected d3DrawBar(markers:d3Base, plot:OrdinalSeriesPlot, colNames:string[]) {
        const [offset, thickness, stackGroup] = this.getParams(plot, colNames);
        const stack = stackGroup? (i:number)=>plot.cfg.stack[stackGroup][i] : ()=>0;
        const xScale = plot.cfg.scales.hor;
        const yScale = plot.cfg.scales.ver;

        if (plot.independentAxis==='hor') { // Column
            const index = colNames.indexOf(<string>plot.dims.y);
            const x  = accessor(plot.dims.x, colNames);
            const y = (r:DataRow,i:number) => <number>r[index] + stack(i);
            const y0 = accessor(stack, colNames);
            markers
                .attr("x",  (d:number[]) => xScale(x(d)) + offset)
                .attr("y",  (d:number[], i:number) => Math.min(yScale(y(d,i)), yScale(y0(d,i))))
                .attr("width",  () => thickness)
                .attr("height", (d:number[], i:number) => Math.abs(yScale(y0(d,i))-yScale(y(d,i))));        
        } else {                            // Bar
            const index = colNames.indexOf(<string>plot.dims.x);
            const x = (r:DataRow,i:number) => <number>r[index] + stack(i);
            const x0 = accessor(stack, colNames);
            const y  = accessor(plot.dims.y, colNames);
            markers
                .attr("x",  (d:number[], i:number) => Math.min(xScale(x(d,i)), xScale(x0(d,i))))
                .attr("y",  (d:number[]) => yScale(y(d)) + offset)
                .attr("height",  () => thickness)
                .attr("width", (d:number[], i:number) => Math.abs(xScale(x0(d,i))-xScale(x(d,i))));
        }
    }

    protected getLine(plot:OrdinalSeriesPlot, rows:DataRow[], colNames:string[]):string {
        const hor = plot.independentAxis==='hor';
        const x  = accessor(plot.dims.x, colNames);
        const y  = accessor(plot.dims.y, colNames);
        const [offset, thickness, stackGroup] = this.getParams(plot, colNames);
        const stack = stackGroup? (i:number)=>plot.cfg.stack[stackGroup][i] : ()=>0;
        const xScale = plot.cfg.scales.hor;
        const yScale = plot.cfg.scales.ver;

        const line = hor?
            stepLine(parseInt(''+thickness), 'hor')
                .x((d:number[], i:number) => xScale(x(d))+offset)
                .y((d:number[], i:number) => yScale(<number>y(d) + stack(i)))
          : stepLine(parseInt(''+thickness), 'ver')
                .x((d:number[], i:number) => xScale(<number>x(d)+stack(i)))
                .y((d:number[], i:number) => yScale(y(d))+offset);
        return line(rows);
    }
}

function stepLine(step:number, axis:'hor'|'ver') {
    let xAccess:(d:DataVal[], i:number)=> number;
    let yAccess:(d:DataVal[], i:number)=> number;
    const accessors = (rows: DataRow[]):string => {
        const result = rows.map((r, i) => {
            const x = parseInt(''+xAccess(r, i));
            const y = parseInt(''+yAccess(r, i));
            return (i===0?'M':'L') + x + ' ' + 
                ((axis==='hor')? (y + 'L' + (x+step)) : ((y+step) + 'L' + x ))
                + ' ' + y;
        }).join('');
        return result;
    };
    accessors.x = (fn:(d:DataVal[], i:number)=> number) => {
        xAccess = fn;
        return accessors;
    };
    accessors.y = (fn:(d:DataVal[], i:number)=> number) => {
        yAccess = fn;
        return accessors;
    };
    return accessors;
}