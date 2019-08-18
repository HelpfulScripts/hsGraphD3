/**
 * # SeriesPlot
 * 
 * Abstract base class for all series plot types.
 * To create a series plot, add the desired plot type to the graph:
 * ```
 * graph.addSeries(<type>, ...<data-columns>);
 * ``` 
 * - <type> is one of the registered types: 
 *     - {@Line `line`} a 2D line plot
 *     - {@Bubble `bubble`} a 2D scatter plot with marker sizes driven by the data
 * 
 */

/** */
import { BaseType }         from 'd3';
import { line as d3line}    from "d3";
import { Line as d3Line }   from "d3";
import { curveCardinal }    from 'd3';
import { Data }             from 'hsdatab';
import { NumDomain }        from 'hsdatab';
import { GraphCfg }         from './GraphComponent';
import { Stroke }           from './Settings';
import { d3Base }           from './Settings';
import { MarkerStyle }      from './Settings';
import { defaultStroke }    from './Settings';
import { defaultMarker }    from './Settings';
import { setStroke }        from './Settings';
import { setFill }          from './Settings';
import { Scales }           from './Scale';

export type d3Selection = d3.Selection<BaseType, unknown, BaseType, unknown>; 

export interface SeriesPlotDefaults {
    line:   Stroke;
    marker: MarkerStyle;
}

export abstract class SeriesPlot { 
    /** the base svg element to render the component into */
    protected svg: d3Base;
    
    /** the render tree configuration */
    protected cfg: GraphCfg;

    /** the unique series key assigned during cinstruction, used to index the series settings. */
    protected seriesKey:string;

    /** 
     * a list of data column names used,
     * reflecting the list of column names provided during construction.
     */
    protected dims: string[] = [];

    /** 
     * a list of data column indices, corresponding to `dims`.
     */
    protected cols: number[] = [];

    constructor(cfg:GraphCfg, seriesName:string, ...params:string[]) {
        this.cfg = cfg; 
        this.seriesKey = seriesName;
        this.dims = params;
    }

    get key() { return this.seriesKey; }

    get dimensions() { return this.dims; }

    /** set the defaults for the series. */
    getDefaults(): SeriesPlotDefaults {
        return {
            line:   defaultStroke(5),
            marker: defaultMarker()
        };
    }

    //---------- lifecylce methods --------------------

    initialize(svg:d3Base): void {
        this.svg = svg.append('g').classed(this.seriesKey, true);
        this.svg.append('g').classed('lines', true).append('path');
        this.svg.append('g').classed('markers', true);
    }

    preRender(data:Data, domains:{[dim:string]: NumDomain}): void {
        const defaults = <SeriesPlotDefaults>this.cfg.defaults.series[this.key];
        this.cols = this.dims.map(d => data.colNumber(d));
        if (this.dims.length > 2) {
            // param 2: size of marker
            this.setMarkerSizeScale(this.dims[2], domains[this.dims[2]]);
        }
        
        const markers = this.svg.select('.markers');
        setStroke(markers, defaults.marker.stroke);
        setFill(markers, defaults.marker.fill);

        const lines = this.svg.select('.lines');
        setStroke(lines, defaults.line);
    }

    /** renders the component for the given data */
    abstract renderComponent(data:Data): void;

    //------- render elements
    setMarkerSizeScale(dataCol:string, domain:NumDomain) {
        const def = this.cfg.defaults.scales.dims[dataCol];
        this.cfg.scales[dataCol] = Scales.createScale(def, domain);
    }

    renderMarkers(data:Data) {
        const defaults = this.cfg.defaults.series[this.key].marker;
        const rScale = this.cfg.scales[this.dims[2]];

        const samples:any = this.svg.select('.markers').selectAll("circle").data(data.getData());
        samples.exit().remove();            // remove unneeded circles
        samples.enter().append('circle')    // add new circles
            .attr("cx", (d:number[]) => this.cfg.scales.hor(<number>d[this.cols[0]]))
            .attr("cy", (d:number[]) => this.cfg.scales.ver(<number>d[this.cols[1]]))
            .attr("r",  (d:number[]) => this.cols[2]? rScale(<number>d[this.cols[2]]) : defaults.size)
        .merge(samples).transition(this.cfg.transition)   // draw markers
            .attr("cx", (d:number[]) => this.cfg.scales.hor(<number>d[this.cols[0]]))
            .attr("cy", (d:number[]) => this.cfg.scales.ver(<number>d[this.cols[1]]))
            .attr("r",  (d:number[]) => this.cols[2]? rScale(<number>d[this.cols[2]]) : defaults.size);
    }

    renderPath(data:Data) {
        const line:d3Line<number[]> = d3line()
            .x(d => this.cfg.scales.hor(d[this.cols[0]]))
            .y(d => this.cfg.scales.ver(d[this.cols[1]]))
            .curve(curveCardinal.tension(0))
        ;
        const path = this.svg.select('.lines').selectAll('path').data([<number[][]>data.getData()]);
        path.transition(this.cfg.transition)
            .attr('d', d => line(d));
    }
}
