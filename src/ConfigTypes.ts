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



