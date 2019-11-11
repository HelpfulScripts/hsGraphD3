/**
 * # Scale
 * 
 * ### Example
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
 * graph.addSeries('line', {x:'time', y:()=>0.5});
 * graph.defaults.scales.dims.ver.type = 'log';
 * graph.render(data);
 * 
 * </file>
 * </example>
 * 
 * ### Scales Default Settings:
 * <example height=300px libs={hsGraphD3:'hsGraphD3', hsUtil:'hsUtil'}>
 * <file name='script.js'>
 * const log = hsUtil.log('');
 * let defaults;
 * 
 * function createGraph(svgRoot) {
 *      const graph = new hsGraphD3.GraphCartesian(svgRoot);
 *      graph.defaults.scales.dims.ver.type = 'log';
 *      return graph.defaults.scales;
 * }
 * 
 * m.mount(root, {
 *   view:() => m('div', {style:'background-color:#eee; font-family:Monospace'}, [
 *      m('div', m.trust('graph.defaults.scales = ' + defaults)), 
 *      m('div.myGraph', '')
 *   ]),
 *   oncreate: () => {
 *      const svgRoot = root.getElementsByClassName('myGraph');
 *      if (svgRoot && svgRoot.length && !defaults) { 
 *          const colors = ['#800', '#080', '#008'];
 *          defaults = hsUtil.log.inspect(createGraph(svgRoot[0]), null, '   ', colors)
 *              .replace(/\n/g, '<br>')
 *      }
 *   } 
 * });
 * </file>
 * </example>
 */

 /** */
import { log as _log }          from 'hsutil'; const log = _log('Scale');
import { ComponentDefaults }    from './GraphComponent'; 
import { GraphComponent }       from './GraphComponent'; 
import { GraphCfg }             from './GraphComponent';
import { UnitVp }               from './Settings';
import * as d3                  from 'd3'; 
import { Domain }               from './Graph';
import { TimeDomain }           from './Graph';
import { NumDomain }            from './Graph';
import { DataVal }              from './Graph';


interface ScaleFn {
    (x: DataVal): number | undefined;
}

/**  */
export type Range  = [UnitVp, UnitVp];

export interface Scale extends ScaleFn {
    copy(): this;
    range(): Range;
    range(range: Range): this;
    rangeBand?():number;
    interpolate?(args:any): this;
    axis(loc:string):d3.Axis<d3.AxisDomain>;
    domain(): Domain;
    domain(domain: Domain): this;
    ticks(count:number): number[];

    bandwidth?(): number;
    paddingInner?(padding?:number): number;
    padding?(padding?:number): number;
    paddingOuter?(padding?:number): number;
    step?(): number;
    type(): string;
}

/**
 * 
 */
export interface ScaleDims {
    [dim:string]: Scale;
}



/**
 * Type of scale. For now, only 'number', 'date', and 'category' exist.
 */
export type ScaleType = 'linear' | 'log' | 'time' | 'ordinal';

export type TimeString = string;    // 5/6/1990 2:57

export interface RangeDefaults {
    min: number|TimeString|'auto';
    max: number|TimeString|'auto';
}

export type CategoricalDefaults = string[];

/**
 * Specisifes the defaults of a specific scale.
 */
export interface ScaleDefaults {    //  extends ComponentDefaults {
    type:   ScaleType;
    aggregateOverTime: boolean;   // 
    domain: RangeDefaults | CategoricalDefaults;
    range:  { min: UnitVp|'auto', max: UnitVp|'auto' };  
}

/**
 * 
 */
export interface ScaleDefaultsDims {
    [dim:string]: ScaleDefaults;
}

/**
 * Specifies the defaults of the Scales Component
 */
export interface ScalesDefaults extends ComponentDefaults {
    margin: { left:number; top:number; right:number; bottom:number; };
    dims: ScaleDefaultsDims;
}

export const scaleDefault = (minRange?:UnitVp, maxRange?:UnitVp):ScaleDefaults => { 
    const def:ScaleDefaults = {
        type:    'linear',
        aggregateOverTime: true,                // 
        domain: {min: 'auto', max: 'auto'},     //  data domain
        range:  {                               //  viewport range
            min: minRange || 'auto', 
            max: maxRange || 'auto' 
        }
    };
    return def;
};

/**
 * Manages the embedding of scales into the graph (margins, etc.) and provides
 * a configuration for each scales used in the graph.
 */
export class Scales extends GraphComponent {
    static type = 'scales';

    constructor(cfg:GraphCfg) { super(cfg, null); }

    get componentType() { return Scales.type; }
    initialize(): void {} 
    preRender(): void {} 
    renderComponent() {}
    postRender(): void {} 

    /** creates a default entry for the component type in `Defaults` */
    public createDefaults():ScalesDefaults {
        return {
            margin: { left:20, top:20, right:20, bottom:30},
            dims: {}
        };
    }

    /**
     * creates a d3 scale object based on the provided settings.
     * @param scaleDef scale defaults, possibly modified by the application
     * @param domain the data domain to scale for
     * @param range the viewport range to scale for 
     */
    public static createScale(scaleDef: ScaleDefaults, domain: Domain, range?:Range):Scale {
        if (!scaleDef) { return; }
        let scales = {
            ordinal:    BandScale,
            time:       TimeScale,
            log:        LogScale,
            linear:     LinearScale,
        };
        return new scales[scaleDef.type](scaleDef, domain, range).getScale();
    }
}

const axes = {
    top:    d3.axisTop,
    bottom: d3.axisBottom,
    left:   d3.axisLeft,
    right:  d3.axisRight
};


abstract class BaseScale {
    constructor(protected d3Scale:any, protected scaleDef: ScaleDefaults, protected domain:Domain, protected range?:Range) {}

    getScale():Scale {
        function _range():Range;
        function _range(r: Range): Scale;
        function _range(r?:Range): any { 
            if (r) { 
                d3Scale.range(r); 
                return scale;
            } else {
                return d3Scale.range(); 
            }
        }

        function _domain(): Domain;
        function _domain(d: Domain): Scale;
        function _domain(d?:any):any { 
            if (d) {
                d3Scale.domain(d);
                return scale;
            } else {
                return d3Scale.domain(); 
            }
        }
        
        const d3Scale = this.d3Scale;
        const scale:Scale = (x:DataVal) => d3Scale(x);
    
        scale.range = _range;
        scale.domain = _domain;
        scale.copy = ():Scale => d3Scale.copy();
        scale.axis = (loc:string):d3.Axis<d3.AxisDomain> => axes[loc](d3Scale);
        scale.ticks = this.getTicks();

        scale.domain(this.getDomain());
        scale.range(this.getRange());
        scale.type = this.getType;
        return scale;
    }

    protected abstract getType():string; 

    protected getTicks() { return (count:number) => this.d3Scale.ticks(count); }

    protected getDomain():Domain { return this.d3Scale.domain(); }
    
    getRange():Range {
        const rangeDef = this.scaleDef.range;
        return [
            (this.range && rangeDef.min === 'auto')? this.range[0] : <number>rangeDef.min, 
            (this.range && rangeDef.max === 'auto')? this.range[1] : <number>rangeDef.max
        ];
    }
}

class BandScale extends BaseScale {
    constructor(protected scaleDef: ScaleDefaults, protected domain:Domain, protected range?:Range) { 
        super(d3.scaleBand(), scaleDef, domain, range); 
    }

    getType() { return 'ordinal'; }

    getScale():Scale {
        const scale = super.getScale();
        scale.bandwidth     = this.d3Scale.bandwidth;
        scale.padding       = this.d3Scale.padding;
        scale.paddingInner  = this.d3Scale.paddingInner;
        scale.paddingOuter  = this.d3Scale.paddingOuter;
        scale.step = this.d3Scale.step;
        return scale;
    }

    protected getTicks() { 
        return () => this.d3Scale.domain(); 
    }

    protected getDomain():Domain { 
        return this.domain || []; 
    }
}


class TimeScale extends BaseScale {
    constructor(scaleDef: ScaleDefaults, protected domain:Domain, range?:Range) { 
        super(d3.scaleTime().interpolate(d3.interpolateRound), scaleDef, domain, range); 
    }

    protected getType() { return 'time'; }

    protected getDomain():TimeDomain {
        const domDef = <RangeDefaults>this.scaleDef.domain;
        return [
            new Date(this.domain && domDef.min === 'auto'? this.domain[0] : domDef.min),
            new Date(this.domain && domDef.max === 'auto'? this.domain[1] : domDef.max)
        ];
    }
}

class NumberScale extends BaseScale {
    constructor(protected d3Scale:any, protected scaleDef: ScaleDefaults, protected domain:Domain, range?:Range) { 
        super(d3Scale.interpolate(d3.interpolateRound), scaleDef, domain, range); 
    }

    protected getType() { return 'number'; }

    protected getDomain():NumDomain {
        const domDef = <RangeDefaults>this.scaleDef.domain;
        return <NumDomain>[
            (this.domain && domDef.min === 'auto'? this.domain[0] : domDef.min),
            (this.domain && domDef.max === 'auto'? this.domain[1] : domDef.max)
        ];
    }
}

class LinearScale extends NumberScale {
    constructor(scaleDef: ScaleDefaults, domain:Domain, range?:Range) { super(d3.scaleLinear(), scaleDef, domain, range); }
}

class LogScale extends NumberScale {
    constructor(scaleDef: ScaleDefaults, domain:Domain, range?:Range) { super(d3.scaleLog(), scaleDef, domain, range); }
}
