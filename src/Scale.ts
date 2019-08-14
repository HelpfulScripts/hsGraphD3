/**
 * # Scale
 * 
 */

import { ComponentDefaults }    from './GraphComponent'; 
import { GraphComponent }       from './GraphComponent'; 
import { UnitVp }               from './Settings';
import { scaleLinear }          from 'd3'; 

export type scaleTypes = 'linear' | 'log';

export interface NumericDefaults {
    min: number|'auto';
    max: number|'auto';
}

export type CategoricalDefaults = string[];

export interface ScaleDimDefaults extends ComponentDefaults {
    type:   scaleTypes;
    domain: NumericDefaults | CategoricalDefaults;
    range:  { min: UnitVp|'auto', max: UnitVp|'auto' };    
}

export interface ScaleDefaults extends ComponentDefaults {
    margin: { left:number; top:number; right:number; bottom:number; };
    dims: {
        [dim:string]: ScaleDimDefaults
    };
}

export const defaultDimScale = (minRange?:UnitVp, maxRange?:UnitVp):ScaleDimDefaults => { 
    return {
        type:   'linear',
        domain: {min: 'auto', max: 'auto'},     //  data domain
        range:  {                               //  canvas range
            min: minRange || 'auto', 
            max: maxRange || 'auto' 
        }    
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
            aggregateOverTime: true,    
            margin: { left:20, top:50, right:20, bottom:10},
            dims: {}
        };
    }


    /**
     * creates a d3 scale object based on the provided settings.
     * @param scaleDef scale defaults, possibly modified by the application
     * @param domain the data domain to scale for
     * @param range the viewport range to scale for 
     */
    public static createScale(scaleDef: ScaleDimDefaults, domain: [number, number], range: UnitVp[]):d3.ScaleContinuousNumeric<number, number> {
        const domDef = <NumericDefaults>scaleDef.domain;
        const rangeDef = scaleDef.range;
        switch(scaleDef.type) {
            case 'linear':
            default:
                return scaleLinear()
                    .domain([
                        domDef.min === 'auto'? domain[0] : domDef.min,
                        domDef.max === 'auto'? domain[1] : domDef.max
                    ])
                    .range([
                        rangeDef.min === 'auto'? range[0] : rangeDef.min, 
                        rangeDef.max === 'auto'? range[1] : rangeDef.max
                    ]);
            }
    }

}

