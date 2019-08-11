/**
 * # Scale
 * 
 */

import { ComponentDefaults }    from './GraphComponent'; 
import { GraphComponent }       from './GraphComponent'; 
import { scaleTypes, UnitVp }   from './ConfigTypes';
import { Defaults }             from './Defaults';

export interface ScaleDimDefaults extends ComponentDefaults {
    type:   scaleTypes;
    domain: {min: number|'auto', max: number|'auto'} | string[];
    range:  { min: UnitVp, max: UnitVp };    
}

export interface ScaleDefaults extends ComponentDefaults {
    margin: { left:number; top:number; right:number; bottom:number;},
    dims: {
        [dim:string]: ScaleDimDefaults
    }
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
    public createDefaults() {
        Defaults.addComponentDefaults(this.componentType, <ScaleDefaults>{
            margin: { left:10, top:10, right:10, bottom:10},
            dims: {}
        });
    }
}

