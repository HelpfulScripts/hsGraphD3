

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

    constructor(cfg:GraphCfg, svgBase:d3Base, ...params:string[]) {
        this.cfg = cfg; 
        this.svg = svgBase; 
        const scales = this.cfg.defaults.scales.dims;
        this.cfg.scales.hor.dataCol = params[0]; // x
        this.cfg.scales.ver.dataCol = params[1]; // y
        scales[params[0]] = scales[params[0]] || scales['hor'] || defaultDimScale(0, 1);
        scales[params[1]] = scales[params[1]] || scales['ver'] || defaultDimScale(0, 1);
    }

    /** set the defaults for the series. */
    abstract getDefaults(): SeriesPlotDefaults;

    /** renders the component for the given data */
    abstract renderComponent(data:Data): void;
}
