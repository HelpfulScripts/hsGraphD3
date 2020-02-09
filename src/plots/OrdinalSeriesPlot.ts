/**
 * # OrdinalSeriesPlot
 * 
 * Abstract base class for all ordinal series plot types.
 * To create a series plot, add the desired plot type to the graph:
 * ```
 * graph.series.add(<type>, {<dim>: <data-values>, ...});
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
import { Log }                  from 'hsutil'; const log = new Log('OrdinalSeriesPlot');
import { DataRow, OrdDomain }              from '../Graph';
import { DataVal }              from '../Graph';
import { NumDomain }            from '../Graph';
import { DataSet }              from '../Graph';
import { ValueDef }             from '../Graph';
import { Domains }              from '../Graph';
import { d3Base }               from '../Settings';
import { Label }                from '../Settings';
import { CartSeriesPlot, text } from '../CartSeriesPlot';
import { SeriesPlotDefaults }   from '../SeriesPlot';
import { Series }               from '../Series';


/**
 * Abstract base class of a  cartesian series plot. 
 */
export abstract class OrdinalSeriesPlot extends CartSeriesPlot { 
    getDefaults(): SeriesPlotDefaults {
        const scaleDef = this.cfg.graph.defaults.scales.dims[this.abscissa];
        scaleDef.type = 'ordinal';
        scaleDef.ordinal = scaleDef.ordinal || { gap:0.3, overlap:0};

        const def = super.getDefaults();
        def.area.rendered = true;
        def.marker.rendered = false;
        def.line.rendered = false;
        def.line.width = 1;
        def.label.color = '#000';
        return def;
    } 

    /**
     * Returns an accessor function to access the numeric value in a data row. 
     * @param dim the semantic dimension ('hor', 'ver', 'size') in which to aggregate
     * @param v data column value definition
     * @param colNames 
     */
    accessor(v:ValueDef, colNames:string[]):(row?:DataRow, rowIndex?:number) => DataVal {
        const stack = this.cfg.stack[this.dims.stacked];
        const stackDim = this.dimensions[this.abscissa==='hor'? 'ver' : 'hor'].indexOf(v)>=0;
        const abscissaCol = {hor:this.dims.x, ver:this.dims.y}[this.abscissa];
        if (this.dims.stacked && stackDim && typeof abscissaCol === 'string') {
            const stackIndex = colNames.indexOf(this.dims.stacked);
            const fn = super.accessor(v, colNames);
            return (row, rowIndex) => {
                return <number>row[stackIndex] + <number>fn(row, rowIndex);
            };
        } else {
            return super.accessor(v, colNames);
        }
    }

    /** ensures that 0 is in the domain, since the columns extend down to 0. */
    protected expandNumDomain(dataSet:DataSet, domain:NumDomain, fn:(row?:DataRow, i?:number) => DataVal):NumDomain {
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
        const scaleDef = this.cfg.graph.defaults.scales.dims[this.abscissa];
        const gap = scaleDef.ordinal.gap;
        const scale = this.cfg.graph.scales.scaleDims[this.abscissa];
        scale.paddingInner(gap);
        scale.paddingOuter(gap/2);
    }
 

    //---------- support methods during lifecylce --------------------

    protected d3RenderMarkers(svg:d3Base, data:DataSet) {
    }

    protected d3RenderPath(svg:d3Base, data:DataSet) {
        const line = this.getLine(data.rows, data.colNames);
        return this.getPathElement(svg, '.line').attr('d', (d:any) => line);
    }

    protected d3RenderFill(svg:d3Base, data:DataSet) {
        const defaults = this.defaults.area;
        if (defaults.rendered) {
            const samples:any = svg.select('.area').selectAll("rect")
                .data(data.rows, d => d[0]);                    // bind to data, iterate over rows
            samples.exit().remove();                            // remove unneeded rects
            samples.enter().append('rect')                      // add new rects
                .call(this.d3DrawBar.bind(this), data.colNames)
                .merge(samples).transition(this.cfg.transition) // draw markers
                .call(this.d3DrawBar.bind(this), data.colNames);
        }
    }
    
    protected d3RenderLabels(svg:d3Base, data:DataSet):void {
        const defaults = this.defaults.label;
        if (defaults.rendered) {
            const samples:any = svg.select('.label').selectAll("text")
            .data(data.rows, d => d[0]);                    // bind to data, iterate over rows
            samples.exit().remove();                        // remove unneeded rects
            samples.enter().append('text')                   // add new rects
                .call(this.d3DrawLabel.bind(this), data.colNames)
                .merge(samples).transition(this.cfg.transition) // draw markers
                .call(this.d3DrawLabel.bind(this), data.colNames);
        }
    }

    protected d3RenderPopup(svg:d3Base, data:DataSet):void {
        const defaults = this.defaults.popup;
        if (defaults.rendered) {
            const samples:any = svg.select('.label').selectAll("text")
            .data(data.rows, d => d[0]);                    // bind to data, iterate over rows
        }
    }

    private getParams(colNames:string[]):any[] {
        const scales = this.cfg.graph.scales;
        const scaleDef = scales.defaults.dims[this.abscissa];
        const stackGroup = this.dims.stacked || false;
        const allKeys = Object.keys(this.cfg.graph.series.defaults).filter(k => k.indexOf(Series.type)===0);
        const myKey = allKeys.indexOf(this.key) || 0;
        const step = scales.scaleDims[this.abscissa].step();
        const pad = scales.scaleDims[this.abscissa].paddingInner();
        const overlap = scaleDef.ordinal.overlap;
        const thickness = step * (1-pad) / (stackGroup? 1 : (allKeys.length * (1-overlap) + overlap));
        const offset = step*pad/2 + (stackGroup? 0 : thickness*myKey * (1-overlap));
        return [offset, thickness];
    }

    /**
     * returns a function that provides the stack base value for the given column Index
     * @param row the data row to consider
     */
    // protected getStackVal(row: number[])

    protected d3DrawBar(markers:d3Base, colNames:string[]) {
        const [offset, thickness] = this.getParams(colNames);

        const xScale = this.cfg.graph.scales.scaleDims.hor;
        const yScale = this.cfg.graph.scales.scaleDims.ver;

        if (this.abscissa==='hor') { // Column
            const x  = this.accessor(this.dims.x, colNames);
            const y  = this.accessor(this.dims.y, colNames);
            const y0 = this.accessor(this.dims.stacked || 0, colNames);
            markers
                .attr("x",  (d:number[]) => xScale(x(d)) + offset)
                .attr("y",  (d:number[]) => Math.min(yScale(y(d)), yScale(y0(d))))
                .attr("width",  () => thickness)
                .attr("height", (d:number[]) => Math.abs(yScale(y(d))-yScale(y0(d))));        
        } else {                            // Bar
            const x0 = this.accessor(this.dims.stacked || 0, colNames);
            const x  = this.accessor(this.dims.x, colNames);
            const y  = this.accessor(this.dims.y, colNames);
            markers
                .attr("x",  (d:number[]) => Math.min(xScale(x(d)), xScale(x0(d))))
                .attr("y",  (d:number[]) => yScale(y(d)) + offset)
                .attr("height",  () => thickness)
                .attr("width", (d:number[]) => Math.abs(xScale(x0(d))-xScale(x(d))));
        }
    }

    protected d3DrawLabel(markers:d3Base, colNames:string[]) {
        const [offset, thickness] = this.getParams(colNames);

        const xScale = this.cfg.graph.scales.scaleDims.hor;
        const yScale = this.cfg.graph.scales.scaleDims.ver;
        
        const l = this.accessor(this.dims.label, colNames);
        const cfg:Label = this.defaults.label;

        const [xpos, ypos, yShift] = this.labelPos(cfg);
        if (this.abscissa==='hor') { // Column
            const x  = this.accessor(this.dims.x, colNames);
            const y  = this.accessor(this.dims.y, colNames);
            const y0 = this.accessor(this.dims.stacked, colNames);
            markers
                .attr("x",  (d:number[]) => xScale(x(d)) + offset + thickness*xpos)
                .attr("y",  (d:number[]) => Math.min(yScale(y(d)), yScale(y0(d)))
                    + Math.abs(yScale(y0(d))-yScale(y(d))) * ypos);
        } else {                            // Bar
            const index = colNames.indexOf(<string>this.dims.x);
            const x0 = this.accessor(this.dims.stacked, colNames);
            const x  = this.accessor(this.dims.x, colNames);
            const y  = this.accessor(this.dims.y, colNames);
            markers
                .attr("x",  (d:number[]) => Math.min(xScale(x(d)), xScale(x0(d)))
                    + Math.abs(xScale(x0(d))-xScale(x(d))) * xpos)
                .attr("y",  (d:number[]) => yScale(y(d)) + offset + thickness* ypos);
        }
        markers
        .attr('dx', (cfg.hOffset||0).toFixed(1) + 'em')
        .attr('dy', ((cfg.vOffset||0)+yShift).toFixed(1) + 'em')
        .style('text-anchor', cfg.xpos)
        .text((d:number[]) => text(l(d)));
    }

    protected getLine(rows:DataRow[], colNames:string[]):string {
        const hor = this.abscissa==='hor';
        const x  = this.accessor(this.dims.x, colNames);
        const y  = this.accessor(this.dims.y, colNames);
        const [offset, thickness] = this.getParams(colNames);

        const xScale = this.cfg.graph.scales.scaleDims.hor;
        const yScale = this.cfg.graph.scales.scaleDims.ver;

        const line = hor?
            stepLine(parseInt(''+thickness), 'hor')
                .x((d:number[]) => xScale(x(d))+offset)
                .y((d:number[]) => yScale(<number>y(d)))
          : stepLine(parseInt(''+thickness), 'ver')
                .x((d:number[]) => xScale(<number>x(d)))
                .y((d:number[]) => yScale(y(d))+offset);
        return line(rows);
    }



    //---------- stack methods --------------------

    /** clears the stack for this cycle before any series rendering happens. */
    public clearStack(data:DataSet) {
        super.clearStack(data);
        const group = this.dims.stacked;
        if (group) {
            const scales = this.cfg.graph.scales.scaleDims;
            const scale = {hor:scales.hor, ver:scales.hor}[this.abscissa];
            if (scale) {
                const domain = <OrdDomain>scale.domain();
                const stack = this.cfg.stack[this.dims.stacked];
                domain.forEach((v:string) => stack[v] = 0);
            }
        }
    }

    /** Create a stack group column if necessary, initializing it to all zeros. */
    protected intializeStackGroup(data:DataSet) {
        this.updateStack(data);
    }

    /** update stack after rendering series. */
    protected updateStack(data:DataSet) {
        const group = this.dims.stacked;
        if (group) {
            const stack = this.cfg.stack[this.dims.stacked];
            const stackCol = data.colNames.indexOf(group);
            const abscissaCol = <string>{hor:this.dims.x, ver:this.dims.y}[this.abscissa];
            const abscissaIndex = data.colNames.indexOf(abscissaCol);
            const ordinateCol = <string>{hor:this.dims.y, ver:this.dims.x}[this.abscissa];
            const ordinateIndex = data.colNames.indexOf(ordinateCol);
            data.rows.forEach(row => {
                const abscissaKey = ''+row[abscissaIndex];
                row[stackCol] = <number>stack[abscissaKey] || 0;
                stack[abscissaKey] += <number>row[ordinateIndex];
            });
        }
    }
}


function stepLine(step:number, axis:'hor'|'ver') {
    interface Accessor { (d:DataVal[]): number; }
    let xAccess:Accessor;
    let yAccess:Accessor;
    const accessors = (rows: DataRow[]):string => {
        const result = rows.map((r, i) => {
            const x = parseInt(''+xAccess(r));
            const y = parseInt(''+yAccess(r));
            return (i===0?'M':'L') + x + ' ' + 
                ((axis==='hor')? (y + 'L' + (x+step)) : ((y+step) + 'L' + x ))
                + ' ' + y;
        }).join('');
        return result;
    };
    accessors.x = (fn:Accessor) => {
        xAccess = fn;
        return accessors;
    };
    accessors.y = (fn:Accessor) => {
        yAccess = fn;
        return accessors;
    };
    return accessors;
}

