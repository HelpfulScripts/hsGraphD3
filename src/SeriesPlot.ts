

import { BaseType }             from 'd3';
import { Data }                 from 'hsdatab';
import { GraphCfg }             from './GraphComponent';
import { Line, Area }           from './Settings';
import { d3Base }               from './Settings';
import { UnitVp }               from './Settings';

export type d3Selection = d3.Selection<BaseType, unknown, BaseType, unknown>; 

export interface MarkerStyle {
    size:   UnitVp;
    shape:  'square' | 'diamond' | 'tri_up' | 'tri_down' | 'circle';
    fill:   Area;
    stroke: Line;
}

export interface SeriesPlotDefaults {
    line:   Line;
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
    abstract getDefaults(): SeriesPlotDefaults;

    initialize(svg:d3Base): void {
        this.svg = svg.append('g').classed(this.seriesKey, true);
    }

    preRender(data:Data): void {
        this.cols = this.dims.map(d => data.colNumber(d));
    }

    /** renders the component for the given data */
    abstract renderComponent(data:Data): void;
}
