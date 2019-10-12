/**
 * # SeriesPlot
 * 
 * Abstract base class for all series plot types.
 * To create a series plot, add the desired plot type to the graph:
 * ```
 * graph.addSeries(<type>, {x:<data-column>, ...});
 * ``` 
 */

/**  */
import { BaseType }             from 'd3';
import { d3Base, }              from "./Settings";
import { defaultStroke }        from "./Settings";
import { defaultMarker }        from "./Settings";
import { defaultFill }          from "./Settings";
import { GraphCfg }             from "./GraphComponent";
import { Area }                 from "./GraphComponent";
import { Line }                 from "./GraphComponent";
import { Marker }               from "./GraphComponent";
import { DataSet }              from "./Graph";
import { Domains }              from "./Graph";
import { GraphDimensions }      from "./Graph";

export type d3Selection = d3.Selection<BaseType, unknown, BaseType, unknown>; 

export interface SeriesPlotDefaults {
    area:   Area;
    line:   Line;
    marker: Marker;
}


export abstract class SeriesPlot { 
    /** the base svg element to render the component into */
    protected svg: d3Base;
    
    /** the render tree configuration */
    protected cfg: GraphCfg;

    /** the unique series key assigned during cinstruction, used to index the series settings. */
    protected seriesKey:string;

    constructor(cfg:GraphCfg, seriesName:string) {
        this.cfg = cfg; 
        this.seriesKey = seriesName;
    }

    public get key() { return this.seriesKey; }

    public abstract get dimensions():GraphDimensions;

    /** 
     * Set the defaults for the series. Called during `addSeries`.
     * */
    public getDefaults(): SeriesPlotDefaults {
        const def:any = {
            line:   defaultStroke(5),
            marker: defaultMarker(),
            area:   defaultFill()
        };
        def.line.rendered = true;
        def.marker.rendered = false;
        def.area.rendered = false;
        return def;
    }
    //---------- lifecylce methods --------------------

    public initialize(svg:d3Base, color?:string): void {
        this.svg = svg.append('g').classed(this.seriesKey, true);
        if (color) { this.svg.style('color', color); }
    }

    public abstract preRender(data:DataSet, domains:Domains): void;

    public abstract renderComponent(data:DataSet): void;
}

