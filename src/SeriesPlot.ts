/**
 * # SeriesPlot
 * 
 * Abstract base class for all series plot types.
 * To create a series plot, add the desired plot type to the graph:
 * ```
 * graph.addSeries(<type>, ...<data-columns>);
 * ``` 
 * - <type> is one of the registered types: 
 *     - &nbsp; {@link plots.Line `line`} a 2D line plot
 *     - &nbsp; {@link plots.Bubble `bubble`} a 2D scatter plot with marker sizes driven by the data
 *     - &nbsp; {@link plots.Area `area`} a 2D area plot filling to the x-axis
 *     - &nbsp; {@link plots.Band `band`} a 2D area plot filling between 2 series 
 *     - &nbsp; {@link plots.TimeSeries `timeseries`} a 2D scatter plot with marker sizes driven by the data
 *     - &nbsp; {@link plots.Voronoi `voronoi`} a voronoi diagrom with centroids and partition
 * 
 */

/** */
import { log as gLog }      from 'hsutil';   const log = gLog('SeriesPlot');
import { BaseType }         from 'd3';
import { line as d3line}    from "d3";
import { Line as d3Line }   from "d3";
import { curveCatmullRom }  from 'd3';
import { DataSet }          from './Graph';
import { Domains }          from './Graph';
import { GraphCfg }         from './GraphComponent';
import { Line }             from './GraphComponent';
import { Area }             from './GraphComponent';
import { Marker }           from './GraphComponent';
import { d3Base }           from './Settings';
import { defaultFill }      from './Settings';
import { defaultStroke }    from './Settings';
import { defaultMarker }    from './Settings';
import { setStroke }        from './Settings';
import { setFill }          from './Settings';
import { scaleDefault }     from './Scale';
import { CartDimensions }   from './GraphCartesian';
import { SeriesDimensions } from './Series';

export type d3Selection = d3.Selection<BaseType, unknown, BaseType, unknown>; 

export interface CartSeriesDimensions extends SeriesDimensions {
    x: string;      // name of x-axis data column
    y: string;      // name of y-axis data column
    y0?: string;    // optional, name of y-axis data column for lower fill border in 'band' 
    r?: string;     // optional, name of marker size data column
}

export interface SeriesPlotDefaults {
    area:   Area;
    line:   Line;
    marker: Marker;
}

/**
 * Abstract base class of a  cartesian series plot. 
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
    protected dims: CartSeriesDimensions;

    protected line:d3Line<number[]>;

    constructor(cfg:GraphCfg, seriesName:string, dims:CartSeriesDimensions) {
        this.cfg = cfg; 
        this.seriesKey = seriesName;
        this.dims = dims;
    }

    get key() { return this.seriesKey; }

    get dimensions():CartDimensions { 
        return {
            hor: [this.dims.x],
            ver: [this.dims.y, this.dims.y0],
            size:[this.dims.r]
        };
    }

    /** 
     * Set the defaults for the series. Called during construction of `Graph`.
     * */
    getDefaults(): SeriesPlotDefaults {
        const def:any = {
            line:   defaultStroke(5),
            marker: defaultMarker(),
            area:   defaultFill()
        };
        def.line.rendered = true;
        def.marker.rendered = true;
        def.area.rendered = false;
        return def;
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
        // this.getCols(data);
        const x = data.colNames.indexOf(this.dims.x);
        const y = data.colNames.indexOf(this.dims.y);
        this.line = d3line()
            .x(d => this.cfg.scales.hor(d[x]))
            .y(d => this.cfg.scales.ver(d[y]))
            .curve(curveCatmullRom.alpha(0.2));
    }

    /** renders the component for the given data */
    renderComponent(data:DataSet): void {
        const defaults = (<SeriesPlotDefaults>this.cfg.defaults.series[this.key]);
        if (defaults.marker.rendered) { this.svg.call(this.d3RenderMarkers.bind(this), data); }
        if (defaults.line.rendered)   { this.svg.call(this.d3RenderPath.bind(this), data); }
        if (defaults.area.rendered)   { this.svg.call(this.d3RenderFill.bind(this), data); }
    }

    protected d3DrawMarker(markers:d3Base, plot:SeriesPlot, data:DataSet) {
        const x = data.colNames.indexOf(plot.dims.x);
        const y = data.colNames.indexOf(plot.dims.y);
        const r = data.colNames.indexOf(plot.dims.r);
        markers
            .attr("cx", (d:number[]) => plot.cfg.scales.hor(d[x]))
            .attr("cy", (d:number[]) => plot.cfg.scales.ver(d[y]))
            .attr("r",  (d:number[]) => (r>=0)? plot.cfg.scales.size(d[r])
                                              : plot.cfg.defaults.series[plot.key].marker.size);
    }
    
    protected d3RenderMarkers(svg:d3Base, data:DataSet) {
        const defaults = (<SeriesPlotDefaults>this.cfg.defaults.series[this.key]).marker;
        if (defaults.rendered) {
            const samples:any = svg.select('.markers').selectAll("circle").data(data.rows, d => d[0]);
            samples.exit().remove();                        // remove unneeded circles
            samples.enter().append('circle')                // add new circles
                .call(this.d3DrawMarker, this, data)
            .merge(samples).transition(this.cfg.transition) // draw markers
                .call(this.d3DrawMarker, this, data);
        }
    }

    protected getPathElement(svg:d3Base, cls:string):any {
        return svg.select(cls).selectAll('path').transition(this.cfg.transition);
    }

    protected d3RenderPath(svg:d3Base, data:DataSet) {
        let main = this.line(<number[][]>data.rows);
        return this.getPathElement(svg, '.line').attr('d', (d:any) => main);
    }

    protected d3RenderFill(svg:d3Base, data:DataSet) {
        const _data = <number[][]>data.rows;
        const line = this.line(_data);
        const closing = this.getFillClosing(data);
        return this.getPathElement(svg, '.area').attr('d', (d:any) => line + closing);
    }

    protected getFillClosing(data:DataSet):string {
        const max = data.rows.length-1;
        const x = data.colNames.indexOf(this.dims.x);
        // LineTo (xmax, 0), (x0, 0)
        return `L${this.cfg.scales.hor(<number>data.rows[max][x])},${this.cfg.scales.ver(0)}` +
               `L${this.cfg.scales.hor(<number>data.rows [0] [x])},${this.cfg.scales.ver(0)}`;
    }
}

