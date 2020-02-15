/**
 */

/**  */
import { Log }                  from 'hsutil'; const log = new Log('SeriesPlot');
import { BaseType }             from 'd3';
import { d3Base, Label, Popup, defaultText, defaultLabel, }              from "./Settings";
import { defaultStroke }        from "./Settings";
import { defaultMarkerStyle }   from "./Settings";
import { defaultArea }          from "./Settings";
import { GraphCfg }             from "./GraphComponent";
import { Area }                 from "./Settings";
import { Line }                 from "./Settings";
import { Marker }               from "./Settings";
import { DataSet, DataVal }     from "./Graph";
import { DataRow }              from "./Graph";
import { NumDomain }            from "./Graph";
import { OrdDomain }            from "./Graph";
import { Domains }              from "./Graph";
import { GraphDimensions }      from "./Graph";

export type d3Selection = d3.Selection<BaseType, unknown, BaseType, unknown>; 

export interface SeriesPlotDefaults {
    area:   Area;
    line:   Line;
    marker: Marker;
    label:  Label;
    popup:  Popup;
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
    /** optional stack group. Series with the same group will be stacked on each other */
    stacked?:     string;
}

/** 
 * Basic `ValueDef` definition, used in {@link SeriesPlot.SeriesPlot `SeriesPlot`}. 
 * - `string`: the name of column in the data set, e.g. `x:'time'`
 * - `number`: a constant value, e.g. `r: 5`
 * - `ValueFn`: a function, returning the value, e.g. `(row, index, rows) => index`.
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
    protected dims: SeriesDimensions;

    /** the base svg element to render the component into */
    protected svg: d3Base;
    
    /** the render tree configuration */
    protected cfg: GraphCfg;

    /** the unique series key assigned during cinstruction, used to index the series settings. */
    protected seriesKey:string;

    constructor(cfg:GraphCfg, seriesName:string, dims:SeriesDimensions) {
        this.cfg = cfg; 
        this.seriesKey = seriesName;
        this.dims = dims;
    }
    
    public get key() { return this.seriesKey; }

    public abstract get dimensions():GraphDimensions;

    protected get defaults():SeriesPlotDefaults { return this.cfg.graph.defaults.series[this.key]; }

    /** 
     * Set the defaults for the series. Called during `addSeries`.
     * */
    public getDefaults(): SeriesPlotDefaults {
        const def:any = {
            line:   defaultStroke(5),
            marker: defaultMarkerStyle(),
            area:   defaultArea(),
            label:  defaultLabel(),
            popup:  defaultText()
        };
        def.line.rendered = false;
        def.marker.rendered = false;
        def.area.rendered = false;
        def.label.rendered = false;
        def.popup.rendered = false;
        return def;
    }

    public expandDomains(dataSet:DataSet, domains:Domains) {
        this.updateStack(dataSet);
        const dims:GraphDimensions = this.dimensions;
        Object.keys(dims).map(dim => { // dim='hor', 'ver', size'
            // const stacked = dim==='size'? null : undefined;
            const type = this.cfg.graph.defaults.scales.dims[dim].type;
            dims[dim].map(colName => { if (colName!==undefined) { 
                const valueFn = this.accessor(colName, dataSet.colNames);
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
     * Returns an accessor function to access the numeric value in a data row. 
     * The type of `v` determines how to access the value: 
     * - If `v` is a function it will be valuated for the provided row index `i` to return the result.
     * - If `v` is a number it will be returned as constant result.
     * - If `v` is a string and contained in `colNames` it specifies the column to index in the 
     * - Otherwise, if `v` ends with 'u', interprets `v` to be Viewport Units and 
     * returns `v` without aplying `scale`. This allows for absolute positioning inside the 
     * supplied `row` to return as result.
     * @param v the `ValueDef` specifying the value
     * @param colNames a list of names for the coluymns in the `DataSet`
     * @return an accessor function `(row?:DataRow, i?:number) => DataVal` 
     * that returns a `DataVal` value. The function
     * receives a `DataRow` and the index of the row in the `DataSet` as a parameter. 
     */
    protected accessor(v:ValueDef, colNames:string[]):(row:DataRow, rowIndex:number) => DataVal {
        switch (typeof(v)) {
            case 'function':return (row, rowIndex) => (<ValueFn>v)(rowIndex);
            case 'number':  log.info(`accessing constant number ${v}`);
                            return () => <DataVal>v;
            case 'string':
            default:        const colIndex = colNames.indexOf(''+v);
                            return (row) => row[colIndex];
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
    
    // /** 
    //  * Create a stack group column if necessary and 
    //  * initialize it to all zeros before rendering this series.
    //  */
    // protected abstract intializeStackGroup(data:DataSet):void;

    /** update stack after rendering series. */
    protected abstract updateStack(data:DataSet):void ;
}

