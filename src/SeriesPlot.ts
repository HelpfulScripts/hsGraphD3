

import { BaseType }             from 'd3';
import { Data }                 from 'hsdatab';
import { defaultDimScale, ScaleDefaults}       from './Scale';
import { GraphCfg }             from './GraphComponent';
import { Line, Area }           from './Defaults';
import { d3Base }               from './Defaults';
import { UnitVp }               from './Defaults';

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

    constructor(cfg:GraphCfg, svgBase:d3Base, ...params:string[]) {
        this.cfg = cfg; 
        this.svg = svgBase; 
        this.seriesKey = svgBase.attr('class');
        this.dims = params;
    }

    get key() { return this.seriesKey; }

    get dimensions() { return this.dims; }

    /** set the defaults for the series. */
    abstract getDefaults(): SeriesPlotDefaults;

    /** renders the component for the given data */
    abstract renderComponent(data:Data): void;
}
