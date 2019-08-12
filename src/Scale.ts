/**
 * # Scale
 * 
 */

import { ComponentDefaults }    from './GraphComponent'; 
import { GraphComponent }       from './GraphComponent'; 
import { scaleTypes, UnitVp }   from './ConfigTypes';

export interface ScaleDimDefaults extends ComponentDefaults {
    type:   scaleTypes;
    domain: {min: number|'auto', max: number|'auto'} | string[];
    range:  { min: UnitVp, max: UnitVp };    
}

export interface ScaleDefaults extends ComponentDefaults {
    margin: { left:number; top:number; right:number; bottom:number; };
    dims: {
        [dim:string]: ScaleDimDefaults
    };
}

export const defaultDimScale = (minRange=0, maxRange=1):ScaleDimDefaults => { 
    return {
        type:   'linear',
        domain: {min: 'auto', max: 'auto'},         //  data domain
        range:  { min: minRange, max: maxRange }    //  canvas range
    };
};


export class Scales extends GraphComponent {
    constructor() { super(null, null); }

    get componentType() { return 'scales'; }

    /** renders the component for the given data */
    renderComponent() {}

    /** creates a default entry for the component type in `Defaults` */
    public createDefaults():ScaleDefaults {
        return {
            margin: { left:20, top:50, right:20, bottom:10},
            dims: {}
        };
    }
}

