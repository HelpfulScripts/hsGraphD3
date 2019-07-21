/**
 * # Configuration Type Declarations
 */

/** */

import { Data, NumDomain }  from 'hsdatab';
import { Defaults }         from './Defaults';

/** viewport units */
export type UnitVp = number;        

/** CSS px units */
export type UnitPx = number;        

/** CSS general units */
export type Unit = string|UnitPx;   // general CSS unit type

export interface RectDef { x:UnitVp; y:UnitVp; width:UnitVp; height:UnitVp; }

export type scaleTypes = 'linear' | 'log';

export type d3Base = d3.Selection<d3.BaseType, unknown, HTMLElement, any>; 

export interface GraphCfg {
    root:       any;
    baseSVG:    d3Base;
    client:     RectDef;
    viewPort: {
        width:  UnitVp;
        height: UnitVp;
    };
    defaults:   Defaults;
    scales:     { 
        hor: { dataCol: string, scale: any}, 
        ver: { dataCol: string, scale: any} 
    };
}

export interface PlotCfg {
    cfg:        GraphCfg;
    plotBase:   d3Base;
}


