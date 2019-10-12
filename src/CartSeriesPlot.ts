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

import { SeriesPlot, SeriesPlotDefaults }           from "./SeriesPlot";
import { SeriesDimensions }     from "./Series";
import { NumberSet, DataSet, Domains }            from "./Graph";
import { CartDimensions }       from "./GraphCartesian";
import { GraphCfg }             from "./GraphComponent";
import { d3Base, setStroke, setFill } from "./Settings";


export interface CartSeriesDimensions extends SeriesDimensions {
    x:   NumberSet;     // name of x-axis data column, or a constant number
    y:   NumberSet;     // name of y-axis data column, or a constant number
    y0?: NumberSet;     // optional, name of y-axis data column for lower fill border, or a constant number
    r?:  NumberSet;     // optional, name of marker size data column, or a constant number
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


    //---------- lifecylce methods --------------------

    initialize(svg:d3Base, color?:string): void {
        this.svg = svg.append('g').classed(this.seriesKey, true);
        if (color) { this.svg.style('color', color); }
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
    renderComponent(data:DataSet): void {
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
