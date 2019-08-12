/**
 * # Defaults Configuration
 * 
 * provides `type` and `interface` declarations for standard svg elements such as texts, lines, areas, etc.
 * as well as 
 * The table below shows a list of available formatting 
 * 
 */

/** */

import * as d       from './Defaults';
import * as gc      from './GraphComponent';
import { log as _log }  from 'hsutil'; const log = _log('Defaults');


/** viewport units */
export type UnitVp = number;        

/** CSS px units */
export type UnitPx = number;        

/** CSS general units */
export type Unit = string|UnitPx;   // general CSS unit type

export interface RectDef { x:UnitVp; y:UnitVp; width:UnitVp; height:UnitVp; }

export type scaleTypes = 'linear' | 'log';

export type d3Base = d3.Selection<d3.BaseType, unknown, HTMLElement, any>; 

export type DefaultsType = {[compName:string]: gc.ComponentDefaults};

export type DefaultsAccess  = (compName:string) => gc.ComponentDefaults;
export type Color           = string;           // CSS color descriptor, e.g. '#fff'
export type ZeroToOne       = number;           // number from [0, 1]
export type Index           = number;           // column index into data table

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


export const defaultLine = (width:UnitVp, color:d.Color='currentColor'):d.Line => {
    return {
        width: width,
        color: color,
        opacity: 1
    };
};

/**
 * convenience function to create a default `RectStyle` object with configurable fill color and border. 
 * @param area  the fill color
 * @param borderWidth the border width in pixel
 * @param borderColor the border color
 */
export const defaultRect = (areaFill:d.Color, borderWidth:UnitVp=0, borderColor:d.Color='currentColor'):d.RectStyle => {
    return {
        rx: 0,
        ry: 0,
        fill: {
            color: areaFill,
            opacity: 1
        },
        stroke: {
            width: borderWidth,
            color: borderColor,
            opacity: 1
        }
    };
};

export const defaultText = (size=16):d.TextStyle => {
    return {
        color: 'currentColor',
        font: {
            family: 'sans-serif',
            size:   size,
            style: 'normal',    // 'normal', 'italic'
            weight: 'normal'    // 'normal', 'bold'
        }
    };
};
