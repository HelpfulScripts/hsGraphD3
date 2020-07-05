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
 * const graph = new hsGraphD3.Graph(root);
 * graph.add('line', {x:'time', y:'costs'});
 * graph.add('line', {x:'time', y:()=>0.5});
 * graph.scales.defaults.dims.ver.type = 'log';
 * graph.render(data);
 * 
 * </file>
 * </example>
 * 
 * ### Scales Default Settings:
 * <example height=300px libs={hsGraphD3:'hsGraphD3', hsUtil:'hsUtil'}>
 * <file name='script.js'>
 * const log = new hsUtil.Log('');
 * let defaults;
 * 
 * function createGraph(svgRoot) {
 *      const graph = new hsGraphD3.Graph(svgRoot);
 *      graph.scales.defaults.dims.ver.type = 'log';
 *      return graph.scales.defaults;
 * }
 * 
 * m.mount(root, {
 *   view:() => m('div', {style:'background-color:#eee; font-family:Monospace'}, [
 *      m('div', m.trust('graph.scales.defaults = ' + defaults)), 
 *      m('div.myGraph', '')
 *   ]),
 *   oncreate: () => {
 *      const svgRoot = root.getElementsByClassName('myGraph');
 *      if (svgRoot && svgRoot.length && !defaults) { 
 *          //const colors = ['#800', '#080', '#008'];
 *          defaults = log.inspect(createGraph(svgRoot[0]))
 *              .replace(/\n/g, '<br>')
 *      }
 *   } 
 * });
 * </file>
 * </example>
 */

 /** */
import { Log }                  from 'hsutil'; const log = new Log('Scale');
import { UnitVp }  from './Settings';
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
    tickCountMajor: number;
    tickCountMinor: number;

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
export type ScaleType = 'linear' | 'log' | 'time' | 'ordinal' | 'none';

export type TimeString = string;    // 5/6/1990 2:57

export interface NumDomDefaults {
    min: number|TimeString|'auto';
    max: number|TimeString|'auto';
}

export type CatDomDefaults = string[];

/**
 * Specisifes the defaults of a specific scale.
 */
export interface ScaleDefaults {    
    type:   ScaleType;
    aggregateOverTime: boolean;   // 
    domain: NumDomDefaults | CatDomDefaults;
    range:  { min: UnitVp|'auto', max: UnitVp|'auto' };  
    ordinal?: { gap:number; overlap:number; };
}


export const scaleDefault = (type:ScaleType, minRange?:UnitVp, maxRange?:UnitVp):ScaleDefaults => { 
    const def:ScaleDefaults = {
        type: type,
        aggregateOverTime: true,                // 
        domain: {min: 'auto', max: 'auto'},     //  data domain
        range:  {                               //  viewport range
            min: minRange || 'auto', 
            max: maxRange || 'auto' 
        }
    };
    switch(type) {
        case 'linear': return def;
        default: return def;
    }
};


const axes = {
    top:    d3.axisTop,
    bottom: d3.axisBottom,
    left:   d3.axisLeft,
    right:  d3.axisRight
};

export class NoScale {
    constructor() {}
    getScale():Scale {
        return undefined;
    }
}


abstract class BaseScale {
    constructor(protected d3Scale:any, protected scaleDef: ScaleDefaults, protected domain:Domain, protected range?:Range) {}

    scaleFn(x:DataVal):any { return this.d3Scale(x); }
    
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
            if (d!==undefined) {
                d3Scale.domain(d);
                return scale;
            } else {
                return d3Scale.domain(); 
            }
        }
        
        const d3Scale = this.d3Scale;
        const scale:Scale = (x:DataVal) => this.scaleFn(x);
    
        scale.range = _range;
        scale.domain = _domain;
        scale.copy = ():Scale => d3Scale.copy();
        scale.axis = (loc:string):d3.Axis<d3.AxisDomain> => axes[loc](d3Scale);
        scale.ticks = this.getTicks();
        scale.tickCountMajor = 2;
        scale.tickCountMinor = 10;

        scale.domain(this.getDomain());
        scale.range(this.getRange());
        scale.type = this.getType;
        return scale;
    }

    protected abstract getType():string; 

    protected getTicks() { return (count:number) => this.d3Scale.ticks(count) }

    protected getDomain():Domain { return this.d3Scale.domain(); }
    
    getRange():Range {
        const rangeDef = this.scaleDef.range;
        return [
            (this.range && rangeDef.min === 'auto')? this.range[0] : <number>rangeDef.min, 
            (this.range && rangeDef.max === 'auto')? this.range[1] : <number>rangeDef.max
        ];
    }
}

export class BandScale extends BaseScale {
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

    // protected getTicks() { 
    //     return () => this.d3Scale.domain(); 
    // }

    protected getDomain():Domain { 
        return this.domain || []; 
    }
}


export class TimeScale extends BaseScale {
    constructor(scaleDef: ScaleDefaults, protected domain:Domain, range?:Range) { 
        super(d3.scaleTime().interpolate(d3.interpolateRound), scaleDef, domain, range); 
    }

    protected getType() { return 'time'; }

    protected getTicks() { return (count:number) => this.d3Scale.ticks(count).map((d:number) => new Date(d)); }

    protected getDomain():TimeDomain {
        const domDef = <NumDomDefaults>this.scaleDef.domain;
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
        const domDef = <NumDomDefaults>this.scaleDef.domain;
        return <NumDomain>[
            (this.domain && domDef.min === 'auto'? this.domain[0] : domDef.min),
            (this.domain && domDef.max === 'auto'? this.domain[1] : domDef.max)
        ];
    }
}

export class LinearScale extends NumberScale {
    constructor(scaleDef: ScaleDefaults, domain:Domain, range?:Range) { super(d3.scaleLinear(), scaleDef, domain, range); }
}

export class LogScale extends NumberScale {
    constructor(scaleDef: ScaleDefaults, domain:Domain, range?:Range) { super(d3.scaleLog(), scaleDef, domain, range); }
    scaleFn(x:DataVal):any { 
        const scaled = this.d3Scale(x); 
        return isNaN(scaled)? (<NumDomDefaults>this.scaleDef.domain).min : scaled;
    }
}
