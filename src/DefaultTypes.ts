/**
 * # Default Styling Type Declarations
 */

/** */

import { UnitVp }       from './ConfigTypes';
import { scaleTypes }   from './ConfigTypes';

export type Color = string;         // CSS color descriptor, e.g. '#fff'
export type ZeroToOne = number;     // number from [0, 1]
export type Index = number;         // column index into data table


export interface Area {
    color: Color;
    opacity: ZeroToOne;
}

export interface Line {
    width: UnitVp;
    color: Color;
    opacity: ZeroToOne;
}

export interface RectStyle {
    rx:     UnitVp;
    ry:     UnitVp;
    fill:   Area;
    stroke: Line;
}

export interface TextStyle {
    color: Color;
    font: {
        family: string;     // e.g. 'sans-serif';
        size: UnitVp;       // e,g, 12
        style: string;      // 'normal', 'italic'
        weight: string;     // 'normal', 'bold'
    };
}

export interface GraphDefaults {
    canvas: RectStyle;
}

export interface PlotDefaults {
    area: RectStyle;
    margin: { left:number, top:number, right:number, bottom:number};
}

export interface SeriesDefaults {
    line:   Line;
    marker: {
        fill:   Area;
        stroke: Line;
    };
}

export interface ScaleDefaults {
    type:   scaleTypes;
    domain: {min: number|'auto', max: number|'auto'} | string[];
    range:  { min: UnitVp, max: UnitVp };
}

export interface AxisDefaults {
    line:       Line;
    tickMarks:  Line;
    tickLabel:  TextStyle;
}

export interface AxesDefaults {
    hor:        AxisDefaults;
    ver:        AxisDefaults;
} 

export interface GridDefaults {
    hor: {
        major: Line;
        minor: Line;
    };
    ver: {
        major: Line;
        minor: Line;
    };
} 
