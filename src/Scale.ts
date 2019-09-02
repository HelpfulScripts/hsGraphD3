/**
 * # Scale
 * 
 */

import { ComponentDefaults }    from './GraphComponent'; 
import { GraphComponent }       from './GraphComponent'; 
import { GraphCfg }             from './GraphComponent';
import { UnitVp }               from './Settings';
import { scaleLinear }          from 'd3'; 
import { interpolateRound }     from 'd3'; 

export type scaleTypes = 'linear' | 'log';

export interface NumericDefaults {
    min: number|'auto';
    max: number|'auto';
}

export type CategoricalDefaults = string[];

export interface ScaleDefaults extends ComponentDefaults {
    type:   scaleTypes;
    aggregateOverTime: boolean;   // 
    domain: NumericDefaults | CategoricalDefaults;
    range:  { min: UnitVp|'auto', max: UnitVp|'auto' };    
}

export interface ScalesDefaults extends ComponentDefaults {
    margin: { left:number; top:number; right:number; bottom:number; };
    dims: {
        [dim:string]: ScaleDefaults
    };
}

export const scaleDefault = (minRange?:UnitVp, maxRange?:UnitVp):ScaleDefaults => { 
    const def:ScaleDefaults = {
        type:   'linear',
        aggregateOverTime: true,                // 
        domain: {min: 'auto', max: 'auto'},     //  data domain
        range:  {                               //  viewport range
            min: minRange || 'auto', 
            max: maxRange || 'auto' 
        }    
    };
    return def;
};

export class Scales extends GraphComponent {
    static type = 'scales';

    constructor(cfg:GraphCfg) { super(cfg, null); }

    get componentType() { return Scales.type; }

    initialize(): void {} 

    preRender(): void {} 

    renderComponent() {}

    /** creates a default entry for the component type in `Defaults` */
    public createDefaults():ScalesDefaults {
        return {
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
    public static createScale(scaleDef: ScaleDefaults, domain: [number, number], range?:[UnitVp, UnitVp]):d3.ScaleContinuousNumeric<number, number> {
        if (!scaleDef) { return; }
        const domDef = <NumericDefaults>scaleDef.domain;
        const rangeDef = scaleDef.range;
        let scale:d3.ScaleLinear<number, number>;
        switch(scaleDef.type) {
            case 'linear':
            default:
                scale = scaleLinear();
                    
            }
        scale.domain([
            domDef.min === 'auto'? domain[0] : domDef.min,
            domDef.max === 'auto'? domain[1] : domDef.max
        ])
        .range([
            (range && rangeDef.min === 'auto')? range[0] : <number>rangeDef.min, 
            (range && rangeDef.max === 'auto')? range[1] : <number>rangeDef.max
        ])
        .interpolate(interpolateRound);
        return scale;
    }
}

