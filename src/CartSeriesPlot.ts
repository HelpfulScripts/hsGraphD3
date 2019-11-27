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

import { log as gLog }          from 'hsutil';   const log = gLog('CartSeriesPlot');
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
import { ScalesDefaults } from './Scale';

/**
 * valid standard dimensions on cartesian plots:
 * - x: a {@ Graph.ValueDef Value Definiton} for the x-axis.
 * - y: a {@ Graph.ValueDef Value Definiton} for the y-axis.
 * - y0: optional {@ Graph.ValueDef Value Definiton} for lower fill border on the y-axis
 * - r: optional {@ Graph.ValueDef Value Definiton} for the size of markers
 */
export interface CartSeriesDimensions extends SeriesDimensions {
    x:   ValueDef;      // name of x-axis data column, or a function returning a value
    y:   ValueDef;      // name of y-axis data column, or a function returning a value
    y0?: ValueDef;      // optional, name of y-axis data column for lower fill border, or a function returning a value
    r?:  ValueDef;      // optional, name of marker size data column, or a function returning a value
}

/**
 * Abstract base class for all cartesian plots.
 */
export abstract class CartSeriesPlot extends SeriesPlot {
    constructor(cfg:GraphCfg, seriesName:string, dims:CartSeriesDimensions) {
        super(cfg, seriesName, dims);
    }

    /** return the GraphDimension of the independent axis */
    protected get independentAxis():'hor'|'ver' { return 'hor'; }

    /** return the list of Series dimesions for each Graph Dimension */
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

        const defaults = this.defaults;
        if (this.dims.r) { defaults.marker.rendered = true; }

        const line = this.svg.select('.line');
        setStroke(line, defaults.line);

        const area = this.svg.select('.area');
        setFill(area, defaults.area);

        const markers = this.svg.select('.markers');
        setStroke(markers, defaults.marker.stroke);
        setFill(markers, defaults.marker.fill);
        this.clearStack();
    }

    public preRender(data:DataSet, domains:Domains): void {
        super.preRender(data, domains);
        this.clearStack();
    }

    /** renders the component for the given data */
    public renderComponent(data:DataSet): void {
        this.intializeStackGroup(data);
        super.renderComponent(data);
        this.renderElements(data);
        this.updateStack(data);
    }

    public postRender(data:DataSet): void {
        super.postRender(data);
    }
        
    //---------- support methods during lifecylce --------------------

    /**
     * returns the `ValueDef`, i.e. column name or `ValueFn`, for which to stack series.
     */
    protected getStackValueDef():ValueDef {
        return this.independentAxis==='hor'? this.dims.y : this.dims.x;
    }

    protected renderElements(data:DataSet) {
        const defaults = this.defaults;
        if (defaults.marker.rendered) { this.svg.call(this.d3RenderMarkers.bind(this), data); }
        if (defaults.line.rendered)   { this.svg.call(this.d3RenderPath.bind(this), data); }
        if (defaults.area.rendered)   { this.svg.call(this.d3RenderFill.bind(this), data); }
    }

    protected abstract d3RenderMarkers(svg:d3Base, data:DataSet):void;

    protected abstract d3RenderPath(svg:d3Base, data:DataSet):void;

    protected abstract d3RenderFill(svg:d3Base, data:DataSet):void;

    protected getPathElement(svg:d3Base, cls:string):any {
        return svg.select(cls).selectAll('path').transition(this.cfg.transition);
    }
}
