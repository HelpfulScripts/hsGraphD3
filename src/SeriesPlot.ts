/**
 * # SeriesPlot
 * 
 * Abstract base class for all series plot types.
 * To create a series plot, add the desired plot type to the graph:
 * ```
 * graph.addSeries(<type>, ...<data-columns>);
 * ``` 
 * - <type> is one of the registered types: 
 *     - &nbsp;{@Line `line`} a 2D line plot
 *     - &nbsp;{@Bubble `bubble`} a 2D scatter plot with marker sizes driven by the data
 *     - &nbsp;{@TimeSeries `timeseries`} a 2D scatter plot with marker sizes driven by the data
 * 
 */

/** */
import { BaseType }         from 'd3';
import { line as d3line}    from "d3";
import { Line as d3Line }   from "d3";
import { curveCardinal }    from 'd3';
import { DataSet }          from './Graph';
import { Domains }          from './Graph';
import { GraphCfg }         from './GraphComponent';
import { Line }             from './GraphComponent';
import { Marker }           from './GraphComponent';
import { d3Base }           from './Settings';
import { defaultStroke }    from './Settings';
import { defaultMarker }    from './Settings';
import { setStroke }        from './Settings';
import { setFill }          from './Settings';
import { scaleDefault }     from './Scale';

export type d3Selection = d3.Selection<BaseType, unknown, BaseType, unknown>; 


export interface SeriesPlotDefaults {
    line:   Line;
    marker: Marker;
}

/**
 * 
 */
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

    protected lines:d3Line<number[]>;

    constructor(cfg:GraphCfg, seriesName:string, ...params:string[]) {
        this.cfg = cfg; 
        this.seriesKey = seriesName;
        this.dims = params;
        const rCol = params[2];
        if (rCol) {
            const scale = this.cfg.defaults.scales.dims;
            scale.size = scale.size || scaleDefault(10, 50);    // default range 
        }
    }

    get key() { return this.seriesKey; }

    get dimensions() { return this.dims; }

    /** set the defaults for the series. */
    getDefaults(): SeriesPlotDefaults {
        const def:any = {
            line:   defaultStroke(5),
            marker: defaultMarker()
        };
        def.line.rendered = true;
        def.marker.rendered = true;
        return def;
    }

    //---------- lifecylce methods --------------------

    initialize(svg:d3Base): void {
        this.svg = svg.append('g').classed(this.seriesKey, true);
        this.svg.append('g').classed('lines', true).append('path');
        this.svg.append('g').classed('markers', true);

        const defaults = <SeriesPlotDefaults>this.cfg.defaults.series[this.key];
        const lines = this.svg.select('.lines');
        setStroke(lines, defaults.line);

        const markers = this.svg.select('.markers');
        setStroke(markers, defaults.marker.stroke);
        setFill(markers, defaults.marker.fill);
    }

    preRender(data:DataSet, domains:Domains): void {
        // const defaults = <SeriesPlotDefaults>this.cfg.defaults.series[this.key];
        this.cols = this.dims.map(d => {
            const c = data.colNames.indexOf(d);
            return c<0? undefined : c;
        });
        this.lines = d3line()
            .x(d => this.cfg.scales.hor(d[this.cols[0]]))
            .y(d => this.cfg.scales.ver(d[this.cols[1]]))
            .curve(curveCardinal.tension(0));
    }

    /** renders the component for the given data */
    renderComponent(data:DataSet): void {
        this.svg
            .call(this.d3RenderMarkers.bind(this), data)
            .call(this.d3RenderPath.bind(this), data);
    }

    protected d3DrawMarker(markers:d3Base, plot:SeriesPlot) {
        markers
            .attr("cx", (d:number[]) => plot.cfg.scales.hor(<number>d[plot.cols[0]]))
            .attr("cy", (d:number[]) => plot.cfg.scales.ver(<number>d[plot.cols[1]]))
            .attr("r",  (d:number[]) => plot.cols[2]? plot.cfg.scales.size(<number>d[plot.cols[2]])
                                                    : plot.cfg.defaults.series[plot.key].marker.size);
    }

    d3RenderMarkers(svg:d3Base, data:DataSet) {
        const defaults = (<SeriesPlotDefaults>this.cfg.defaults.series[this.key]).marker;
        if (defaults.rendered) {
            const rScale = this.cfg.scales[this.dims[2]];

            const samples:any = svg.select('.markers').selectAll("circle").data(data.rows, d => d[0]);
            samples.exit().remove();            // remove unneeded circles
            samples.enter().append('circle')    // add new circles
                .call(this.d3DrawMarker, this)
            .merge(samples).transition(this.cfg.transition)   // draw markers
                .call(this.d3DrawMarker, this);
        }
    }

    d3RenderPath(svg:d3Base, data:DataSet) {
        const defaults = (<SeriesPlotDefaults>this.cfg.defaults.series[this.key]).line;
        if (defaults.rendered) {
            const path = svg.selectAll('path'); // .data([<any>data.rows], d => { console.log(d); return ''+(d&&d[0])?d[0][0]:''; });
            path.transition(this.cfg.transition)
                .attr('d', d => this.lines(<number[][]>data.rows));
        }
    }
}
