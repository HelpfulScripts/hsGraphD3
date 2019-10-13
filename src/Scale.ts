/**
 * # Scale
 * 
 * ## Example
 * Use of a logarithmic scale:
 * <example height=200px libs={hsGraphD3:'hsGraphD3'}>
 * <file name='script.js'>
 * const data = {
 *    colNames:['time', 'costs'], 
 *    rows:[[0,   0.2], [0.2, 0.7], [0.4, 0.1],
 *          [0.6, 0.5], [0.8, 0.3], [1,   0.2]]
 * };
 * 
 * const graph = new hsGraphD3.GraphCartesian(root);
 * graph.addSeries('line', {x:'time', y:'costs'});
 * graph.addSeries('line', {x:'time', y:0.5});
 * graph.defaults.scales.dims.ver.type = 'log';
 * graph.render(data);
 * 
 * </file>
 * </example>
 * 
 */

 /** */
import { log as _log }          from 'hsutil'; const log = _log('Scale');
import { ComponentDefaults }    from './GraphComponent'; 
import { NumberScale }          from './GraphComponent'; 
import { GraphComponent }       from './GraphComponent'; 
import { GraphCfg }             from './GraphComponent';
import { UnitVp }               from './Settings';
import { scaleLinear }          from 'd3'; 
import { scaleLog }             from 'd3'; 
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
    public static createScale(scaleDef: ScaleDefaults, domain: [number, number], range?:[UnitVp, UnitVp]):NumberScale {
        if (!scaleDef) { return; }
        const domDef = <NumericDefaults>scaleDef.domain;
        const rangeDef = scaleDef.range;
        let scale:NumberScale;  //d3.ScaleLinear<number, number>;
log.info(`create scale ${scaleDef.type}`);
        switch(scaleDef.type) {
            case 'log':     scale = scaleLog().interpolate(interpolateRound);
                            break;
            case 'linear':
            default:        scale = scaleLinear().interpolate(interpolateRound);  
            }
        scale.domain([
            domDef.min === 'auto'? domain[0] : domDef.min,
            domDef.max === 'auto'? domain[1] : domDef.max
        ])
        .range([
            (range && rangeDef.min === 'auto')? range[0] : <number>rangeDef.min, 
            (range && rangeDef.max === 'auto')? range[1] : <number>rangeDef.max
        ])
        ;
        return scale;
    }
}

