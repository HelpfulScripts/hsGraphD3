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
import { defaultStroke }    from './Settings';
import { defaultMarker }    from './Settings';
import { setStroke }        from './Settings';
import { setFill }          from './Settings';
import { scaleDefault }     from './Scale';

export type d3Selection = d3.Selection<BaseType, unknown, BaseType, unknown>; 


export interface SeriesPlotDefaults {
    area:   Area;
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
    protected cols: number[];

    protected line:d3Line<number[]>;

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

    /** 
     * Set the defaults for the series. Called during construction of `Graph`.
     * */
    getDefaults(): SeriesPlotDefaults {
        const def:any = {
            line:   defaultStroke(5),
            marker: defaultMarker(),
            area:   {
                color: 'currentColor',
                opacity: 0.5
            }
        };
        def.line.rendered = true;
        def.marker.rendered = true;
        def.area.rendered = false;
        return def;
    }

    //---------- lifecylce methods --------------------

    initialize(svg:d3Base): void {
        this.svg = svg.append('g').classed(this.seriesKey, true);
        this.svg.append('g').classed('area', true).append('path');
        this.svg.append('g').classed('line', true).append('path');
        this.svg.append('g').classed('markers', true);

        const defaults = <SeriesPlotDefaults>this.cfg.defaults.series[this.key];
        const line = this.svg.select('.line');
        setStroke(line, defaults.line);

        const area = this.svg.select('.area');
        setFill(area, defaults.area);

        const markers = this.svg.select('.markers');
        setStroke(markers, defaults.marker.stroke);
        setFill(markers, defaults.marker.fill);
    }

    protected getCols(data:DataSet) {
        this.cols = this.cols || this.dims.map(d => {
            const c = data.colNames.indexOf(d);
            return c<0? undefined : c;
        });
    }

    preRender(data:DataSet, domains:Domains): void {
        this.getCols(data);
        this.line = d3line()
            .x(d => this.cfg.scales.hor(d[this.cols[0]]))
            .y(d => this.cfg.scales.ver(d[this.cols[1]]))
            .curve(curveCatmullRom.alpha(0.2));
    }

    /** renders the component for the given data */
    renderComponent(data:DataSet): void {
        const defaults = (<SeriesPlotDefaults>this.cfg.defaults.series[this.key]);
        if (defaults.marker.rendered) {
            this.svg.call(this.d3RenderMarkers.bind(this), data);
        }
        if (defaults.line.rendered) {
            this.svg.call(this.d3RenderPath.bind(this), data);
        }
        if (defaults.area.rendered) {
            this.svg.call(this.d3RenderFill.bind(this), data);
        }
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

    getPathElement(svg:d3Base, cls:string):any {
        return svg.select(cls).selectAll('path').transition(this.cfg.transition);
    }

    d3RenderPath(svg:d3Base, data:DataSet) {
        let main = this.line(<number[][]>data.rows);
        return this.getPathElement(svg, '.line').attr('d', (d:any) => main);
    }

    d3RenderFill(svg:d3Base, data:DataSet) {
        log.info('seriesplot fill');
        this.getCols(data);
        const _data = <number[][]>data.rows;
        const max = _data.length-1;
        const prefix = `M${this.cfg.scales.hor(_data[0][this.cols[0]])},${this.cfg.scales.ver(0)}L`;
        const main = this.line(_data).slice(1);
        const postfix = `L${this.cfg.scales.hor(_data[max][this.cols[0]])},${this.cfg.scales.ver(0)}`;
        return this.getPathElement(svg, '.area').attr('d', (d:any) => prefix + main + postfix);
    }
}
