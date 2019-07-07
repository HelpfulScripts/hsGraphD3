/**
 * 
 */

/** */

import { log as gLog }  from 'hsutil';   const log = gLog('d3.GraphComponent');
import { Defaults }     from './Defaults';

import { Data }         from 'hsdatab';
import { GraphCfg }     from './ConfigTypes';

const vpWidth:number    = 1000;

export abstract class GraphComponent {
    protected config: GraphCfg;
    constructor(cfg?: GraphCfg) { 
        this.config = cfg || {
            root: undefined,
            baseSVG: undefined,    
            client: {
                x:0, y:0,
                width: 0, height: 0
            },
            viewPort: {
                width: vpWidth,
                height: vpWidth * 0.7   // initial height: 70% of width
            },
            defaults: undefined,
            scales: { 
                hor: { dataCol: undefined, scale: undefined}, 
                ver: { dataCol: undefined, scale: undefined} 
            } 
        };
        this.config.defaults = new Defaults(this.config);
    }
    public abstract render(data:Data): void;
}
