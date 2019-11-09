/**
 * # CartSeriesPlot
 * 
 * Abstract base class for all series plot types on cartesian coordinates.
 * To create a series plot, add the desired plot type to the graph:
 * ```
 * graph.addSeries(<type>, ...<data-columns>);
 * ``` 
 */


/** */

import { SeriesPlot }           from "./SeriesPlot";
import { SeriesPlotDefaults }   from "./SeriesPlot";
import { SeriesDimensions }     from "./Series";
import { ValueDef }             from "./Graph";
import { DataSet }              from "./Graph";
import { Domains }              from "./Graph";
import { CartDimensions }       from "./GraphCartesian";
import { GraphCfg }             from "./GraphComponent";
import { d3Base }               from "./Settings";
import { setStroke }            from "./Settings";
import { setFill }              from "./Settings";


export interface CartSeriesDimensions extends SeriesDimensions {
    x:   ValueDef;     // name of x-axis data column, or a function returning a value
    y:   ValueDef;     // name of y-axis data column, or a function returning a value
    y0?: ValueDef;     // optional, name of y-axis data column for lower fill border, or a function returning a value
    r?:  ValueDef;     // optional, name of marker size data column, or a function returning a value
}

export abstract class CartSeriesPlot extends SeriesPlot {
    /** 
     * a list of data column names used,
     * reflecting the list of column names provided during construction.
     */
    protected dims: CartSeriesDimensions;

    constructor(cfg:GraphCfg, seriesName:string, dims:CartSeriesDimensions) {
        super(cfg, seriesName);
        this.dims = dims;
    }

    get dimensions():CartDimensions { 
        return {
            hor: [this.dims.x],
            ver: [this.dims.y, this.dims.y0],
            size:[this.dims.r]
        };
    }

    /** 
     * Set the defaults for the series. Called during `addSeries`.
     * */
    public getDefaults(): SeriesPlotDefaults {
        const def = super.getDefaults();
        if (this.dims.r)  { def.marker.rendered = true; }
        if (this.dims.y0) { def.area.rendered = true; }
        return def;
    }

    //---------- lifecylce methods --------------------

    public initialize(svg:d3Base, color?:string): void {
        super.initialize(svg, color);
        this.svg.append('g').classed('area', true).append('path');
        this.svg.append('g').classed('line', true).append('path');
        this.svg.append('g').classed('markers', true);

        const defaults = <SeriesPlotDefaults>this.cfg.defaults.series[this.key];
        if (this.dims.r) { defaults.marker.rendered = true; }

        const line = this.svg.select('.line');
        setStroke(line, defaults.line);

        const area = this.svg.select('.area');
        setFill(area, defaults.area);

        const markers = this.svg.select('.markers');
        setStroke(markers, defaults.marker.stroke);
        setFill(markers, defaults.marker.fill);
    }

    preRender(data:DataSet, domains:Domains): void {
    }


    /** renders the component for the given data */
    public renderComponent(data:DataSet): void {
        const defaults = (<SeriesPlotDefaults>this.cfg.defaults.series[this.key]);
        if (defaults.marker.rendered) { this.svg.call(this.d3RenderMarkers.bind(this), data); }
        if (defaults.line.rendered)   { this.svg.call(this.d3RenderPath.bind(this), data); }
        if (defaults.area.rendered)   { this.svg.call(this.d3RenderFill.bind(this), data); }
    }

        
    //---------- support methods during lifecylce --------------------

    protected abstract d3RenderMarkers(svg:d3Base, data:DataSet):void;

    protected abstract d3RenderPath(svg:d3Base, data:DataSet):void;

    protected abstract d3RenderFill(svg:d3Base, data:DataSet):void;
}
