/**
 * # CartSeriesPlot
 * 
 * Abstract base class for all series plot types on cartesian coordinates.
 * To create a series plot, add the desired plot type to the graph:
 * ```
 * graph.add(<type>, {<dim>: <ValueDef>, ...});
 * ``` 
 * - `<type>` is one of the registered types. See plot types for {@link plots.OrdinalSeriesPlot ordinal series} and {@link plots.NumericSeriesPlot numeric series}.
 * - `<dim>` is the semantic dimension to set. See {@link CartSeriesPlot.CartSeriesDimensions CartSeriesDimensions} for valid dimensions. 
 * - `<ValueDef>` is the {@link SeriesPlot.ValueDef value definition}. 
 */


/** */

import { Log }                  from 'hsutil'; const log = new Log('CartSeriesPlot');
import { SeriesPlot }           from "./SeriesPlot";
import { SeriesPlotDefaults }   from "./SeriesPlot";
import { SeriesDimensions }     from "./SeriesPlot";
import { ValueDef }             from "./SeriesPlot";
import { DataRow, GraphDimensions }              from "./Graph";
import { AccessFn }             from "./Graph";
import { DataSet }              from "./Graph";
import { GraphCfg }             from "./GraphComponent";
import { d3Base }               from "./Settings";
import { defaultStroke }        from "./Settings";

export interface CartDimensions extends GraphDimensions { 
    hor:ValueDef[]; 
    ver:ValueDef[]; 
    size:ValueDef[]; 
}


/**
 * valid {@link SeriesPlot.ValueDef `Value Definiton`} dimensions on cartesian plots:
 * - `x`?:  optional values for the x-axis. If omitted, the index of y-values will be used as x-values
 * - `y`:   values for the y-axis.
 * - `y0`?: optional values for lower fill border on the y-axis; defaults to `0`
 * - `r`?:  optional values for the size of markers. If provided, marker rendering is enabled.
 * </ul>
 * Inherited from {@link SeriesPlot.SeriesDimensions SeriesDimensions}:<ul>
 * - `label`?: optional values for item {@link SeriesPlot.SeriesDimensions.label labels}
 * - `popup`?: optional values to show in mouse-over {@link SeriesPlot.SeriesDimensions.popup popups}.
 * - `color`?: optional values to determine {@link SeriesPlot.SeriesDimensions.color marker colors}
 * - `stacked`?: optional {@link SeriesPlot.SeriesDimensions.stacked stack group}. 
 *    Series with the same group will be stacked on each other
 */
export interface CartSeriesDimensions extends SeriesDimensions {
    /** 
     * optional, name of x-axis data column, or a function returning a value.
     * If omitted, the index of y-values will be used as x-values.
     */
    x?:  ValueDef;    
    /** name of y-axis data column, or a function returning a value */ 
    y:   ValueDef;    
    /** optional, name of y-axis data column for lower fill border, or a function returning a value */
    y0?: ValueDef;  
    /** optional, name of marker size data column, or a function returning a value */
    r?:  ValueDef;   
}


/**
 * Abstract base class for all cartesian plots.
 */
export abstract class SeriesPlotCartesian extends SeriesPlot {
    /** the main data line  */
    protected line: string;         // d3Line<number[]>;

    // protected popupDiv:d3Base;

    constructor(cfg:GraphCfg, seriesName:string, dims:CartSeriesDimensions) {
        super(cfg, seriesName, dims);
        this.type = 'cartesian';
    }

    protected get dims(): CartSeriesDimensions { return <CartSeriesDimensions>super.dims; }

    /** return the GraphDimension of the independent axis */
    protected abscissa:'hor'|'ver' = 'hor';

    /** return the list of scalable Series dimesions for each Graph Dimension */
    get dimensions():CartDimensions { 
        return {
            hor: [this.dims.x],
            ver: [this.dims.y, this.dims.y0],
            size:[this.dims.r],
        };
    }

    /** 
     * Set the defaults for the series. Called during `addSeries`.
     * */
    public getDefaults(): SeriesPlotDefaults {
        const def = super.getDefaults();
        if (this.dims.r)    { 
            def.marker.rendered = true; 
            def.marker.stroke = defaultStroke(1);
        } else {
            def.marker.stroke = defaultStroke(0);
        }
        if (this.dims.y0)   { 
            def.area.rendered = true; 
        }
        if (this.dims.label){ 
            def.label.rendered = true; 
            def.label.color = '#000';
        }
        return def;
    }

    /**
     * Returns an accessor function to access the numeric value in a data row. 
     * @param dim the semantic dimension ('hor', 'ver', 'size') in which to aggregate
     * @param v data column value definition
     * @param colNames 
     */
    accessor(v:ValueDef, colNames:string[], useStack=true):AccessFn {
        if (useStack && this.dims.stacked) {
            // stackDim = is 'v' a stackable dimension?
            const stackDim = this.dimensions[this.abscissa==='hor'? 'ver' : 'hor'].indexOf(v)>=0;
            const abscissaCol = {hor:this.dims.x, ver:this.dims.y}[this.abscissa];
            if (stackDim && typeof abscissaCol === 'string') {
                const stackIndex = colNames.indexOf(this.dims.stacked);
                const fn = super.accessor(v, colNames);
                return (row, rowIndex) => <number>row[stackIndex] + <number>fn(row, rowIndex);
            }
        }
        return super.accessor(v, colNames);
    }


    //---------- lifecylce methods --------------------

    public initialize(plot:d3Base, color?:string): void {
        super.initialize(plot, color);
        if (this.dims.popup===undefined) { this.dims.popup = {hor: this.dims.y, ver: this.dims.x}[this.abscissa]; }

        // if abscissa data is missing, use implicit index as data
        if (this.abscissa === 'hor') {
            if (!this.dims.x) { this.dims.x = (i:number)=> i; }
        } else {
            if (!this.dims.y) { this.dims.y = (i:number)=> i; }
        }
    }

    public preRender(data:DataSet): void {
        super.preRender(data);
        this.clearStack(data);
        this.line = undefined;
    }

    /** renders the component for the given data */
    public renderComponent(data:DataSet): void {
        data = { colNames: data.colNames, rows: data.rows.slice() };
        this.updateStack(data);
        super.renderComponent(data);
    }

    public postRender(data:DataSet): void {
        super.postRender(data);
    }
        
    //---------- support methods during lifecylce --------------------

    protected d3RenderMarkers(plot:d3Base, data:DataSet) {
        const shape = this.markerShape();
        const defaults = this.defaults;
        const popup = this.cfg.components.popup;
        if (defaults.marker.rendered) {
            plot.select('.markers').selectAll(shape)
                .data(data.rows, d => d[0]) // bind to first DataVal, rather than to DataRow, iterate over rows
                .join(shape)              
                .call(popup.addListener.bind(popup), this.d3RenderPopup(data))
                .transition(this.cfg.transition)
                .call(this.d3DrawMarker.bind(this), data, defaults)
                .call(this.d3MarkerColors.bind(this), data, defaults);
        }
    }

    protected abstract markerShape():string;

    protected d3RenderLine(plot:d3Base, data:DataSet) {
        this.line = this.line || this.getPath(data.rows, data.colNames, this.dims.y);
        return this.getPathElement(plot, '.line').attr('d', (d:any) => this.line);
    }


    protected abstract d3RenderFill(plot:d3Base, data:DataSet):void;

    protected d3RenderLabels(plot:d3Base, data:DataSet):void {
        const defaults = this.defaults;
        const popup = this.cfg.components.popup;
        if (defaults.label.rendered) {
            plot.select('.label').selectAll("text")
                .data(data.rows, (d:any[]) => d[0]) // bind to first DataVal, rather than to DataRow, iterate over rows
                .join('text')                       
                .call(popup.addListener.bind(popup), this.d3RenderPopup(data))
                .transition(this.cfg.transition) 
                .call(this.d3DrawLabels.bind(this), data, defaults);
        }
    }

    protected abstract d3DrawMarker(markers:d3Base, data:DataSet, defaults:SeriesPlotDefaults):void;

    protected abstract d3DrawLabels(labels:d3Base, data:DataSet, defaults:SeriesPlotDefaults):void;

    protected getPathElement(plot:d3Base, cls:string):any {
        return plot.select(cls).selectAll('path').transition(this.cfg.transition);
    }

    protected abstract getPath(rows:DataRow[], colNames:string[], yDef?: ValueDef, useStack?:boolean):string;

    //---------- stack methods --------------------

    /** clears the stack for this cycle before any series rendering happens. */
    public clearStack(data:DataSet) {
        const group = this.dims.stacked;
        if (group) {
            if (data.colNames.indexOf(group) < 0) { 
                data.colNames.push(group); 
            }
            const stackCol = data.colNames.indexOf(group);
            data.rows.forEach(row => row[stackCol] = 0);
            this.cfg.stack[this.dims.stacked] = {};
        }
    }
    
    // /** Create a stack group column if necessary, initializing it to all zeros. */
    // protected intializeStackGroup(data:DataSet) { }

    /** update stack after rendering series. */
    protected updateStack(data:DataSet) {
        const group = this.dims.stacked;
        if (group) {
            const stack = this.cfg.stack[group];
            const stackCol = data.colNames.indexOf(group);
            const abscissaCol = <string>{hor:this.dims.x, ver:this.dims.y}[this.abscissa];
            const abscissaIndex = data.colNames.indexOf(abscissaCol);
            const ordinateCol = <string>{hor:this.dims.y, ver:this.dims.x}[this.abscissa];
            const ordinateIndex = data.colNames.indexOf(ordinateCol);
            data.rows.forEach(row => {
                const abscissaKey = ''+row[abscissaIndex];
                row[stackCol] = <number>stack[''+abscissaKey] || 0;
                stack[''+abscissaKey] = (stack[''+abscissaKey]||0) + <number>row[ordinateIndex];
            });
        }
    }
}
