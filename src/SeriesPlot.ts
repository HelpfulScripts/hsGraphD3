/**
 */

/**  */
import { Log }                  from 'hsutil'; const log = new Log('SeriesPlot');
import { BaseType }             from 'd3';
import { d3Base }               from "./Settings";
import { defaultLine }          from "./Settings";
import { defaultMarker }        from "./Settings";
import { Label }                from "./Settings";
import { defaultLabel }         from "./Settings";
import { schemes }              from "./Settings";
import { defaultArea }          from "./Settings";
import { GraphCfg }             from "./GraphComponent";
import { Area }                 from "./Settings";
import { Line }                 from "./Settings";
import { Marker }               from "./Settings";
import { DataSet }              from "./Graph";
import { DataVal }              from "./Graph";
import { AccessFn }             from "./Graph";
import { DataRow }              from "./Graph";
import { NumDomain }            from "./Graph";
import { OrdDomain }            from "./Graph";
import { Domains }              from "./Graph";
import { GraphDimensions }      from "./Graph";
import { format as d3format}    from 'd3';

export type d3Selection = d3.Selection<BaseType, unknown, BaseType, unknown>; 

export interface SeriesPlotDefaults {
    area:   Area;
    line:   Line;
    marker: Marker;
    label:  Label;
}

/**
 * specify the values to use for different semantic dimension (e.g. 'x' for the x-axis) of 
 * each {@link SeriesPlot.SeriesPlot `SeriesPlot`}.
 * For each dimension, the value can be either 
 * - a string that identifies the column name in the data set to use
 * - or a {@link SeriesPlot.ValueFn `ValueFn`} function that returns the data to use.
 */
export interface SeriesDimensions { 
    [dim:string]: ValueDef; 
    /** optional, name of label data column, or a function returning a value */
    label?: ValueDef;  
    /** optional, name of popup data column, or a function returning a value */
    popup?: ValueDef;   
    /** optional, name of color data column, or a function returning a value */
    color?: ValueDef;   
    /** optional stack group. Series with the same group will be stacked on each other */
    stacked?:     string;
}

/** 
 * Basic `ValueDef` definition, used in {@link SeriesPlot.SeriesPlot `SeriesPlot`}. 
 * - `string`: the name of column in the data set, e.g. `x:'time'`
 * - `number`: a constant value, e.g. `r: 5`
 * - {@link SeriesPlot.ValueFn `ValueFn`}: a function returning the value.
 */
export type ValueDef = string|number|ValueFn;

/** 
 * a function returning the value of a data point 
 * The function will be called at runtime once for each row in the data set 
 * supplied when calling `render`, and will receive as parameters the 
 * `index` of the row in the {@link Graph.DataSet `DataSet's`} rows array.
 */
export interface ValueFn { (rowIndex:number): DataVal; }

/**
 * coverts a `DataVal` to a `string`
 * @param val 
 */
export function text(val:DataVal) {
    return typeof val==='number'? val.toFixed(1) : <string>val;
}


/**
 * Abstract base class for all series plot types. It manages
 * - setting the series' defaults
 * - expanding domains to values of this series
 * - the rendering lifecycle for the series
 * - maintaining a stack mechanism that allows series to be stacked on one another
 * To create a series plot, add the desired plot type to the graph:
 * ```
 * graph.series.add(<type>, {x:<ValueDef>, ...});
 * ``` 
 * where {@link SeriesPlot.ValueDef `ValueDef`} is a data reference, either
 * - the name of a column in the data set to use
 * - or a function, returning the data to use. 
 * To specify a constant of value 5, simply supply `()=>5`.
 */
export abstract class SeriesPlot { 
    /** 
     * a list of data column names used,
     * reflecting the list of column names provided during construction.
     */
    private _dims: SeriesDimensions;

    /** the base svg element to render the component into */
    protected svg: d3Base;
    
    /** the render tree configuration */
    protected cfg: GraphCfg;

    /** the unique series key assigned during cinstruction, used to index the series settings. */
    protected seriesKey:string;

    /** return the GraphDimension of the independent axis */
    protected abscissa:string;


    constructor(cfg:GraphCfg, seriesName:string, dims:SeriesDimensions) {
        this.cfg = cfg; 
        this.seriesKey = seriesName;
        this._dims = dims;
    }
    
    public get key() { return this.seriesKey; }

    protected get dims(): SeriesDimensions { return this._dims; }

    public abstract get dimensions():GraphDimensions;

    protected get defaults():SeriesPlotDefaults { return this.cfg.graph.defaults.series[this.key]; }

    /** 
     * Set the defaults for the series. Called during `addSeries`.
     * */
    public getDefaults(): SeriesPlotDefaults {
        const def:SeriesPlotDefaults = {
            line:   defaultLine(5),
            marker: defaultMarker(),
            area:   defaultArea(),
            label:  defaultLabel()
        };
        def.line.rendered = false;
        def.marker.rendered = false;
        def.area.rendered = false;
        def.label.rendered = false;
        return def;
    }

    public expandDomains(dataSet:DataSet, domains:Domains) {
        this.updateStack(dataSet);
        const dims:GraphDimensions = this.dimensions;
        Object.keys(dims).map(dim => { // dim='hor', 'ver', size'
            const useStack = dim!=='size';  // donst stack-scale marker sizes
            const type = this.cfg.graph.defaults.scales.dims[dim].type;
            dims[dim].map(colName => { if (colName!==undefined) { 
                const valueFn = this.accessor(colName, dataSet.colNames, useStack);
                switch(type) {
                    case 'ordinal':     
                        domains[dim] = this.expandOrdinalDomain(dataSet, <OrdDomain>domains[dim] || [], valueFn); 
                        break;
                    default:            
                        domains[dim] = this.expandNumDomain(dataSet, <NumDomain>domains[dim] || [1e99, -1e99], valueFn);
                }
            }});
        });
    }
    
    protected expandNumDomain(dataSet:DataSet, domain:NumDomain, fn:(row?:DataRow, i?:number) => DataVal):NumDomain {
        return <NumDomain>dataSet.rows.reduce((dom:NumDomain, row:DataRow, i:number):NumDomain => {
            const val = <number>fn(row, i);
            dom[0] = Math.min(val, dom[0]);
            dom[1] = Math.max(val, dom[1]);
            return dom;
        }, domain);
    }
    
    protected expandOrdinalDomain(dataSet:DataSet, domain:OrdDomain, fn:(row?:DataRow, i?:number) => DataVal):OrdDomain {
        return <OrdDomain>dataSet.rows.reduce((dom:OrdDomain, row:DataRow, i:number):OrdDomain => {
            const val = <string>fn(row, i);
            if (dom.indexOf(val) < 0) { dom.push(val); }
            return dom;
        }, domain);
    }

    /**
     * Returns an accessor function `(row:DataVal[], rowIndex:number) => DataVal` to access the numeric value in a data row.
     * The type of `v` determines how to access the value: 
     * - If `v` is a function it will be valuated for the provided `row` and `rowIndex` to return the result.
     * - If `v` is a number it will be returned as constant result.
     * - If `v` is a string and contained in `colNames` it specifies the column to index in `row` 
     * @param v the `ValueDef` specifying the value
     * @param colNames a list of names for the coluymns in the `DataSet`
     * @return an accessor function `(row:DataVal[], rowIndex:number) => DataVal` 
     * that returns a `DataVal` value. The function
     * receives a `DataRow` and the index of the row in the `DataSet` as a parameter. 
     */
    protected accessor(v:ValueDef, colNames:string[], useStack=true):(row:DataRow, rowIndex:number) => DataVal {
        switch (typeof(v)) {
            case 'function':return (row, rowIndex) => (<ValueFn>v)(rowIndex);
            case 'number':  return () => <DataVal>v;
            case 'string':
            default:        const c = colNames.indexOf(''+v); 
                            // try row.data[c] (as passed by d3.arc), then row[c]
                            return (row) => row['data']? row['data'][c] : row[c];
        }
    }


    /**
     * applies `stroke` and `fill` colors to `items`.
     * Colors are determined by the `color` tag in the series definition as in
     * ```graph.series.add('column', {x:'item', y:'Mary', color:<colorValue>}); ```
     * Various coloring modes are available via the <colorValue> tag:
     * - `string`: 
     *     a. addresses a data column containing
     *          - `numbers`: used to index the `default.marker.scheme` table
     *          - `strings`: used as direct colors; must be in the format '#rgb'  
     *     b. if not addressing a data column, the value addresses an entry in an
     *        internal color schemes list. Available entries are 
     *          [cat10](https://github.com/d3/d3-scale-chromatic#schemeCategory10),
     *          [blues](https://github.com/d3/d3-scale-chromatic#schemeBlues),
     *          [greens](https://github.com/d3/d3-scale-chromatic#schemeGreens),
     *          [greys](https://github.com/d3/d3-scale-chromatic#schemeGreys),
     *          [oranges](https://github.com/d3/d3-scale-chromatic#schemeOranges),
     *          [purples](https://github.com/d3/d3-scale-chromatic#schemePurples),
     *          [reds](https://github.com/d3/d3-scale-chromatic#schemeReds)
     * - `number`: used to index the `default.marker.scheme` table
     * - `function (rowIndex:number)=>string` a function, returning a '#rgb' string for the 
     *    provided row index
     * @param items the items being colored
     * @param numRows the number of data rows
     */
    protected d3MarkerColors(items:d3Base, data:DataSet, defaults:SeriesPlotDefaults) {
        function getColor(d:number[], i:number):string  {
            const scheme = schemes[defaults.marker.scheme];
            if (typeof colors === 'function') {
                const color = colors(i);
                return typeof color === 'number'? scheme((color % 10) / 10) : <string>color;
            } else if (typeof colors === 'string') {
                const col = data.colNames.indexOf(colors);
                if (col >= 0) {
                    return d['data']? scheme(d['data'][col]) : scheme(d[col]);
                } else if (schemes[colors]) { 
                    return schemes[colors](i / data.rows.length);
                } else {
                    return colors;
                }
            } else if (typeof colors === 'number') {
                return scheme((colors % 10) / 10);
            } else {
                return '#f00';
            }
        }
        const colors = this.dims.color;
        if (colors) {
            // items.attr('stroke', getColor)
            //      .attr('fill', getColor);
            items.attr('color', getColor);
        }
    }   

        /**
     * formats the popup string to display
     * @param colNames 
     */
    protected d3RenderPopup(data:DataSet):AccessFn {
        if (this.dims.popup) {
            const format = d3format('.4r');
            const popupAccess = this.accessor(this.dims.popup, data.colNames, false);
            const abscissa = this.dimensions[this.abscissa][0];
            const absAccess     = this.accessor(abscissa, data.colNames, false);
            // if dims x present, reflect its column nname; else use 'index'
            const absName = typeof abscissa === 'string'? abscissa : this.abscissa;
            return (r:DataVal[], i:number) => {
                let val = popupAccess(r,i);
                if (typeof val === 'number') { val = format(val); }
                return typeof this.dims.popup === 'function' ? popupAccess(r,i) :`
                    ${this.dims.popup} = ${val}<br>
                    ${absName} = ${absAccess(r,i)}
                `;
            };
        }
    }


    //---------- lifecylce methods -------------------

    public initialize(svg:d3Base, color?:string): void {
        this.svg = svg.append('g').classed(this.seriesKey, true);
        if (color) { this.svg.style('color', color); }
    }

    public preRender(data:DataSet, domains:Domains): void {}

    public renderComponent(data:DataSet): void {}

    public postRender(data:DataSet): void {}



    //---------- stack methods --------------------

    /** clears the stack for this cycle before any series rendering happens. */
    public abstract clearStack(data:DataSet):void;
    
    /** update stack after rendering series. */
    protected abstract updateStack(data:DataSet):void ;
}

