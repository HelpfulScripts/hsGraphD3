


import { Log }                  from 'hsutil'; const log = new Log('Scales');
import { GraphComponent }       from './GraphComponent'; 
import { ComponentDefaults }    from './GraphComponent'; 
import { GraphCfg }             from './GraphComponent';
import { Scale, Range }         from './Scale';
import { ScaleDefaults }        from './Scale';
import { NoScale, BandScale }   from './Scale';
import { TimeScale }            from './Scale';
import { LogScale, LinearScale }from './Scale';
import { Domains, DataSet }              from './Graph';

import { Domain }               from './Graph';

/**
 * Specifies the defaults of the Scales Component
 */
export interface ScalesDefaults extends ComponentDefaults {
    margin: { left:number; top:number; right:number; bottom:number; };
    dims: ScaleDefaultsDims;
    type: SystemType;
}

export type SystemType = 'polar' | 'cartesian' | 'none';

/**
 * 
 */
export interface ScaleDefaultsDims {
    [dim:string]: ScaleDefaults;
}

/**
 * Manages the embedding of scales into the graph (margins, etc.) and provides
 * a configuration for each scales used in the graph.
 */
export class Scales extends GraphComponent {
    static type = 'scales';

    private scales: { [name:string]: Scale; } = {};

    protected cumulativeDomains: Domains = {};

    constructor(cfg:GraphCfg) { super(cfg, null); }

    public get componentType() { return Scales.type; }
    public get defaults():ScalesDefaults { return this.cfg.graph.defaults.scales; }
    public get scaleDims() { return this.scales; }

    public initialize(): void {
        const margins = this.defaults.margin;
        const vp = this.cfg.viewPort;
        switch(this.defaults.type) {
            case 'polar':
                this.createScale('ang', this.cumulativeDomains.ang);
                this.createScale('rad', this.cumulativeDomains.rad, [0, Math.min(vp.height-margins.bottom-margins.top, vp.width-margins.left-margins.right)/2]);    
                break;
            case 'cartesian':
                this.createScale('hor', this.cumulativeDomains.hor, [margins.left,  vp.width-margins.right]);
                this.createScale('ver', this.cumulativeDomains.ver, [vp.height-margins.bottom, margins.top]);
                this.createScale('size', this.cumulativeDomains.size);
                break;
            case 'none':
            default:
            }
    } 

    public preRender(data:DataSet | DataSet[]): void {
        const dims = this.defaults.dims;
        this.cumulate(data);
        Object.keys(dims).forEach(dim => this.setDomain(dim, this.cumulativeDomains[dim]));
    } 

    public renderComponent() {}
    public postRender(): void {} 

    /** creates a default entry for the component type in `Defaults` */
    public createDefaults():ScalesDefaults {
        return {
            margin: { left:20, top:20, right:20, bottom:30},
            dims: {},
            type: undefined
        };
    }

    /**
     * creates a d3 scale object based on the provided settings.
     * @param name name of the new scale, must also match the name of a predefined scale default.
     * @param domain the data domain to scale for
     * @param range the viewport range to scale for 
     */
    public createScale(name:string, domain: Domain, range?:Range):Scale {
        const scaleDef: ScaleDefaults = this.defaults.dims[name];
        if (!scaleDef) { 
            log.warn(`can't create scale ${name}; no default available`);
            return; 
        }
        let scales = {
            none:       NoScale,
            ordinal:    BandScale,
            time:       TimeScale,
            log:        LogScale,
            linear:     LinearScale,
        };
        this.scales[name] = new scales[scaleDef.type](scaleDef, domain, range).getScale();
        this.setDomain(name, domain);
        return this.scales[name];
    }

    protected setDomain(name:string, domain: Domain) {
        if (domain && domain.length===2 && !isNaN(<number>domain[0]) && !isNaN(<number>domain[1])) {
            if (domain[0]>0 && domain[0]===domain[1]) {
                // log.info(`expanding ${name} from [${domain[0]},${domain[1]}] to [0, ${domain[1]}]`);
                domain[0] = 0;
            }
        }
        this.scales[name].domain(domain);
    }

    protected cumulate(data:DataSet | DataSet[]) {
        const dims = this.defaults.dims;
        const dom = this.cumulativeDomains;
        Object.keys(dims).forEach(dim => dom[dim]  = (dom[dim]  && dims[dim].aggregateOverTime)?  dom[dim]  : undefined)
        this.cfg.components.series.expandDomains(data, this.cumulativeDomains);
    }
}
