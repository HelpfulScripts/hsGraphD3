/**
 * # CartSeriesPlot
 * 
 * Abstract base class for all series plot types on cartesian coordinates.
 * To create a series plot, add the desired plot type to the graph:
 * ```
 * graph.series.add(<type>, ...<data-columns>);
 * ``` 
 */


/** */

import { Log }                  from 'hsutil'; const log = new Log('CartSeriesPlot');
import { SeriesPlot }           from "./SeriesPlot";
import { SeriesPlotDefaults }   from "./SeriesPlot";
import { SeriesDimensions }     from "./SeriesPlot";
import { ValueDef }             from "./SeriesPlot";
import { DataVal }              from "./Graph";
import { DataSet }              from "./Graph";
import { Domains }              from "./Graph";
import { CartDimensions }       from "./GraphCartesian";
import { GraphCfg }             from "./GraphComponent";
import { d3Base, defaultStroke }               from "./Settings";
import { setLabel }             from "./Settings";
import { setPopup}              from "./Settings";
import { Label }                from "./Settings";
import { setArea }              from "./Settings";
import { setStroke }            from "./Settings";
import { setFill }              from "./Settings";

/**
 * valid {@link SeriesPlot.ValueDef `Value Definiton`} dimensions on cartesian plots:
 * - `x`?:  optional values for the x-axis. If omitted, the index of y-values will be used as x-values
 * - `y`:   values for the y-axis.
 * - `y0`?: optional values for lower fill border on the y-axis; defaults to `0`
 * - `r`?:  optional values for the size of markers. If provided, marker rendering is enabled.
 * - `label`?: optional values for item labels
 * - `popup`?: optional values to show in mouse-over popups.
 */
export interface CartSeriesDimensions extends SeriesDimensions {
    /** name of x-axis data column, or a function returning a value */
    x:   ValueDef;    
    /** name of y-axis data column, or a function returning a value */ 
    y:   ValueDef;    
    /** optional, name of y-axis data column for lower fill border, or a function returning a value */
    y0?: ValueDef;  
    /** optional, name of marker size data column, or a function returning a value */
    r?:  ValueDef;   
    /** optional, name of label data column, or a function returning a value */
    label?: ValueDef;  
    /** optional, name of popup data column, or a function returning a value */
    popup?: ValueDef;   
    /** optional, name of color data column, or a function returning a value */
    color?: ValueDef;   
}

/**
 * coverts a `DataVal` to a `string`
 * @param val 
 */
export function text(val:DataVal) {
    return typeof val==='number'? val.toFixed(1) : <string>val;
}


/**
 * Abstract base class for all cartesian plots.
 */
export abstract class CartSeriesPlot extends SeriesPlot {
    constructor(cfg:GraphCfg, seriesName:string, dims:CartSeriesDimensions) {
        super(cfg, seriesName, dims);
    }

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
        if (this.dims.r)    { def.marker.rendered = true; }
        if (this.dims.y0)   { def.area.rendered = true; }
        if (this.dims.label){ 
            def.label.rendered = true; 
            def.label.color = '#000';
        }
        def.marker.stroke = defaultStroke(0);
        if (this.dims.popup){ def.popup.rendered  = true; }
        return def;
    }



    //---------- lifecylce methods --------------------

    public initialize(svg:d3Base, color?:string): void {
        super.initialize(svg, color);
        const defaults = this.defaults;

        if (!this.dims.x) { this.dims.x = (i:number)=> i; }
        if (!this.dims.y) { this.dims.y = (i:number)=> i; }

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
            defaults.marker.rendered = true; 
            const markers = this.svg.select('.markers');
            setStroke(markers, defaults.marker.stroke);
            setFill(markers, defaults.marker.fill);
        }
        if (defaults.label.rendered) {
            this.svg.append('g').classed('label', true);
            const label = this.svg.select('.label');
            setLabel(label, defaults.label);
        }
        if (defaults.popup.rendered) {
            this.svg.append('g').classed('popup', true);
            const popup = this.svg.select('.popup');
            setPopup(popup, defaults.popup);
        }
    }

    public preRender(data:DataSet, domains:Domains): void {
        super.preRender(data, domains);
        this.clearStack(data);
    }

    /** renders the component for the given data */
    public renderComponent(data:DataSet): void {
        data = { colNames: data.colNames, rows: data.rows.slice() };
        // this.intializeStackGroup(data);
        this.updateStack(data);
        super.renderComponent(data);
        this.renderElements(data);
    }

    public postRender(data:DataSet): void {
        super.postRender(data);
    }
        
    //---------- support methods during lifecylce --------------------

    protected renderElements(data:DataSet) {
        const defaults = this.defaults;
        if (defaults.marker.rendered) { this.svg.call(this.d3RenderMarkers.bind(this), data); }
        if (defaults.line.rendered)   { this.svg.call(this.d3RenderPath.bind(this), data); }
        if (defaults.area.rendered)   { this.svg.call(this.d3RenderFill.bind(this), data); }
        if (defaults.label.rendered)  { this.svg.call(this.d3RenderLabels.bind(this), data); }
        if (defaults.popup.rendered)  { this.svg.call(this.d3RenderPopup.bind(this), data); }
    }

    protected abstract d3RenderMarkers(svg:d3Base, data:DataSet):void;

    protected abstract d3RenderPath(svg:d3Base, data:DataSet):void;

    protected abstract d3RenderFill(svg:d3Base, data:DataSet):void;

    protected abstract d3RenderLabels(svg:d3Base, data:DataSet):void;

    protected abstract d3RenderPopup(svg:d3Base, data:DataSet):void;

    protected getPathElement(svg:d3Base, cls:string):any {
        return svg.select(cls).selectAll('path').transition(this.cfg.transition);
    }

    protected abstract labelPos(cfg:Label, labels:d3Base):void;


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
    
    /** Create a stack group column if necessary, initializing it to all zeros. */
    protected intializeStackGroup(data:DataSet) { }

    /** update stack after rendering series. */
    protected updateStack(data:DataSet) { }
}
