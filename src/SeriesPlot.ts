/**
 */

/**  */
import { Log }                  from 'hsutil'; const log = new Log('SeriesPlot');
import { BaseType }             from 'd3';
import { format as d3format}    from 'd3';
import { d3Base, Index }        from "./Settings";
import { defaultLine }          from "./Settings";
import { defaultMarker }        from "./Settings";
import { Label }                from "./Settings";
import { defaultLabel }         from "./Settings";
import { schemes }              from "./Settings";
import { defaultArea }          from "./Settings";
import { Area }                 from "./Settings";
import { Line }                 from "./Settings";
import { Marker }               from "./Settings";
import { GraphCfg }             from "./GraphComponent";
import { DataSet }              from "./Graph";
import { DataVal }              from "./Graph";
import { AccessFn }             from "./Graph";
import { DataRow }              from "./Graph";
import { GraphDimensions }      from "./Graph";
import { setLabel }             from "./Settings";
import { setArea }              from "./Settings";
import { setStroke }            from "./Settings";
import { setFill }              from "./Settings";
import { SystemType }           from './Scales';

export type d3Selection = d3.Selection<BaseType, unknown, BaseType, unknown>; 

export interface SeriesPlotDefaults {
    dims:       SeriesDimensions;
    area:       Area;
    line:       Line;
    marker:     Marker;
    label:      Label;
    transition: boolean;
}

/**
 * specifies the valid dimensions (e.g. 'x' for the x-axis) for a {@link SeriesPlot.SeriesPlot `SeriesPlot`}.
 * For each dimension, the value can be either 
 * - a string that identifies the column name in the data set to use
 * - or a {@link SeriesPlot.ValueFn `ValueFn`} function that returns the data to use.
 * </ul>
 * Optional auxiliary dimensions for all plots:<ul>
 * - `label`?: optional values for item {@link SeriesPlot.SeriesDimensions.label labels}
 * - `popup`?: optional values to show in mouse-over {@link SeriesPlot.SeriesDimensions.popup popups}.
 * - `color`?: optional values to determine {@link SeriesPlot.SeriesDimensions.color marker colors}
 * - `stacked`?: optional {@link SeriesPlot.SeriesDimensions.stacked stack group}. 
 *    Series with the same group will be stacked on each other
 */
export interface SeriesDimensions { 
    [dim:string]: ValueDef; 
    /** 
     * optional, name of label data column, or a function returning a value.
     * See {@link Settings.Label Settings.Label} for configuring labels.
     */
    label?: ValueDef;  
    /** 
     * optional, name of popup data column, or a function returning a value.
     * The popup is triggered when the mouse enters a marker or label area.
     * If omitted, a default popup will configured to show the marker's 
     * abscissa and ordinate names and values.
     * See {@link Popup Popup} for an example.
     */
    popup?: ValueDef;   
    /** 
     * optional, name of color data column, or a function returning a value.
     * The returned color will be used on the marker of that data point. If 
     * omitted, the `series'` color will be used, as defined in the default settinmgs:
     * `graph.defaults.series.<seriesKey>.marker.fill`. 
     * See {@link SeriesPlot.SeriesPlot.d3MarkerColors marker colors} for more details.
     */
    color?: ValueDef;   
    /** 
     * optional stack group. Series with the same group will be stacked on each other. 
     * `stacked` differes from other dimensions in that the `ValueDef` is always a `string`
     * used as a unique identifier for the series to be stacked (and not as a named index into the data set).
     * For example: `stacked:'myStack'` would stack all series with the ID `myStack`. 
     */
    stacked?:     string;
}

/** 
 * Basic `ValueDef` definition, used in {@link SeriesPlot.SeriesPlot `SeriesPlot`}. 
 * - `string`: the name of column in the data set, e.g. `x:'time'`
 * - `number`: a constant value, e.g. `r: 5`
 * - `ValueFn`: a {@link SeriesPlot.ValueFn `user-defined function`} returning the value.
 * - `string[]`: a list of column names, e.g. `['from', 'to']`
 */
export type ValueDef = string|number|ValueFn|string[];

/** 
 * a user-defined function returning the {@link Graph.DataVal `DataVal`} of a data point.
 * The function will be called at runtime once for each row in the data set.
 * @param rowIndex the index of the row in the {@link Graph.DataSet `DataSet's`} rows array. 
 * @return the value of type `DataVal` to use for the row.
 */
export interface ValueFn { (rowIndex:Index): DataVal; }

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
 * graph.add(<type>, {<dim>:<ValueDef>, ...});
 * ``` 
 * where `<dim>` specifies a {@link SeriesPlot.SeriesDimensions series dimension}
 * and {@link SeriesPlot.ValueDef `ValueDef`} provides the data values for the dimension, 
 * as one of:
 * - the name of a column in the data set to use
 * - a constant number
 * - or a user-defined {@link SeriesPlot.ValueFn function}, returning the data to use. 
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

    /** 
     * determines the required type of graph for this lot:  
     * - 'cartesian': plot on a cartesian x/y coordinate system 
     * - 'polar': plot on a polar r/phi coordinate system
     * - 'none': plot on a non-metric graph such as `sankey`
     */
    protected type: SystemType;


    constructor(cfg:GraphCfg, seriesName:string, dims:SeriesDimensions) {
        this.cfg = cfg; 
        this.seriesKey = seriesName;
        this._dims = dims;
        this.type = 'none';
    }
    
    public get key() { return this.seriesKey; }

    public get graphType() { return this.type; }

    protected get dims(): SeriesDimensions { return this._dims; }

    public abstract get dimensions():GraphDimensions;

    protected get defaults():SeriesPlotDefaults { return this.cfg.graph.defaults.series[this.key]; }

    /** 
     * Set the defaults for the series. Called during `addSeries`.
     * */
    public getDefaults(): SeriesPlotDefaults {
        const def:SeriesPlotDefaults = {
            dims:   this._dims,
            line:   defaultLine(5),
            marker: defaultMarker(),
            area:   defaultArea(),
            label:  defaultLabel(),
            transition: true
        };
        def.line.rendered = false;
        def.marker.rendered = false;
        def.area.rendered = false;
        def.label.rendered = false;
        return def;
    }

    /**
     * Returns an accessor function `(row:DataVal[], rowIndex:Index) => DataVal` to access the numeric value in a data row.
     * The type of `v` determines how to access the value: 
     * - If `v` is a function it will be valuated for the provided `row` and `rowIndex` to return the result.
     * - If `v` is a number it will be returned as constant result.
     * - If `v` is a string and contained in `colNames` it specifies the column to index in `row` 
     * @param v the `ValueDef` specifying the value
     * @param colNames a list of names for the coluymns in the `DataSet`
     * @return an accessor function `(row:DataVal[], rowIndex:Index) => DataVal` 
     * that returns a `DataVal` value. The function
     * receives a `DataRow` and the index of the row in the `DataSet` as a parameter. 
     */
    protected accessor(v:ValueDef, colNames:string[], useStack=true):(row:DataRow, rowIndex:Index) => DataVal {
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
     * ```
     * graph.add('column', {x:'item', y:'Mary', color:<colorValue>}); 
     * ```
     * Various coloring modes are available via the `<colorValue>` tag:
     * - `string`: 
     *     1. addresses a data column containing
     *          - `numbers`: used to index the `default.marker.scheme` table
     *          - `strings`: used as direct colors; must be in the format `#rgb` 
     *     2. if not addressing a data column, the value addresses an entry in an
     *        internal color schemes list. Available entries are 
     *          [cat10](https://github.com/d3/d3-scale-chromatic#schemeCategory10),
     *          [blues](https://github.com/d3/d3-scale-chromatic#schemeBlues),
     *          [greens](https://github.com/d3/d3-scale-chromatic#schemeGreens),
     *          [greys](https://github.com/d3/d3-scale-chromatic#schemeGreys),
     *          [oranges](https://github.com/d3/d3-scale-chromatic#schemeOranges),
     *          [purples](https://github.com/d3/d3-scale-chromatic#schemePurples),
     *          [reds](https://github.com/d3/d3-scale-chromatic#schemeReds)
     * - `number`: used to index the `default.marker.scheme` table
     * - `function (rowIndex:Index)=>string` a function, returning a `#rgb` string for the 
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

    protected d3FillColors(items:d3Base, data:DataSet, defaults:SeriesPlotDefaults) {
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

        const defaults = this.defaults;
        if (defaults.area.rendered) {
            this.svg.append('g').classed('area', true).append('path');
            const area = this.svg.select('.area');
            setArea(area, defaults.area);
        }
        if (defaults.line.rendered) {
            this.svg.append('g').classed('line', true).append('path');
            const line = this.svg.select('.line');
            setStroke(line, defaults.line);
        }
        if (defaults.marker.rendered) {
            this.svg.append('g').classed('markers', true);
            const markers = this.svg.select('.markers');
            setStroke(markers, defaults.marker.stroke);
            setFill(markers, defaults.marker.fill);
        }
        if (defaults.label.rendered) {
            this.svg.append('g').classed('label', true);
            const label = this.svg.select('.label');
            setLabel(label, defaults.label);
        }
    }

    public preRender(data:DataSet): void {}

    public renderComponent(data:DataSet): void {
        const defaults = this.defaults;
        if (defaults.marker.rendered) { this.svg.call(this.d3RenderMarkers.bind(this), data); }
        if (defaults.line.rendered)   { this.svg.call(this.d3RenderLine.bind(this), data); }
        if (defaults.area.rendered)   { this.svg.call(this.d3RenderFill.bind(this), data); }
        if (defaults.label.rendered)  { this.svg.call(this.d3RenderLabels.bind(this), data); }
    }

    public postRender(data:DataSet): void {}

    protected abstract d3RenderMarkers(plot:d3Base, data:DataSet):void;
    protected abstract d3RenderLine(plot:d3Base, data:DataSet):void;
    protected abstract d3RenderFill(plot:d3Base, data:DataSet):void;
    protected abstract d3RenderLabels(plot:d3Base, data:DataSet):void;
}

