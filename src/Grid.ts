/**
 * # Grid class
 * 
 */

 /** */
import { log as gLog }      from 'hsutil';   const log = gLog('Grid');
import { GraphComponent }   from './GraphComponent'; 
import { ComponentDefaults }from './GraphComponent'; 
import { GraphCfg }         from './GraphComponent';
import { d3Base }           from './Settings';
import { Line }             from './Settings';
import { defaultLine }      from './Settings';
import { setLine }          from './Settings';
import { Direction }        from './Axis';
 
export enum MajorMinor {
    major   = 'major',
    minor   = 'minor'
}

export interface GridDefaults extends ComponentDefaults {
    hor: {
        major: Line;
        minor: Line;
    };
    ver: {
        major: Line;
        minor: Line;
    };
} 

export class Grids extends GraphComponent {
    private grids = {
        hor: { major: <Grid>undefined, minor: <Grid>undefined },
        ver: { major: <Grid>undefined, minor: <Grid>undefined }
    };
    constructor(cfg:GraphCfg) {
        super(cfg, cfg.baseSVG.select('.grids'));
        this.grids['hor']['major'] = new Grid(cfg, Direction.horizontal, MajorMinor.major);
        this.grids['hor']['minor'] = new Grid(cfg, Direction.horizontal, MajorMinor.minor);
        this.grids['ver']['major'] = new Grid(cfg, Direction.vertical, MajorMinor.major);
        this.grids['ver']['minor'] = new Grid(cfg, Direction.vertical, MajorMinor.minor);
    }

    get componentType() { return 'grids'; }

    public createDefaults():GridDefaults {
        return {
            hor: {
                major: defaultLine(1,'#444'),
                minor: defaultLine(1, '#eee')
            },
            ver: {
                major: defaultLine(1,'#444'),
                minor: defaultLine(1, '#eee')
            }
        };
    }

    renderComponent() {
        this.grids['hor']['major'].renderComponent();
        this.grids['hor']['minor'].renderComponent();
        this.grids['ver']['major'].renderComponent();
        this.grids['ver']['minor'].renderComponent();
    }
}

export class Grid {
    private hor: boolean;
    private svg: d3Base;
 
    constructor(protected cfg:GraphCfg, protected dir:Direction, protected type=MajorMinor.major) {
        const baseClass = `${dir}-${type}-Grid`;
        this.hor = this.dir===Direction.horizontal;
        this.svg = cfg.baseSVG.select('.grids').append('g').classed(baseClass, true);
    }
 
    renderComponent() {
        const count = this.type===MajorMinor.major? 2 : 10;
        const scales = this.cfg.defaults.scales.dims;
        const scaleX = this.cfg.scales.hor;
        const scaleY = this.cfg.scales.ver;
        const style = this.cfg.defaults.grids[this.dir][this.type];
        setLine(this.svg, style);
        const c = {
            range:  this.hor? scales['hor'].range : scales['ver'].range,
            scale:  this.hor? scaleY : scaleX,  
            dim:    this.hor? { fix:'x', var:'y'} : { fix:'y', var:'x'},
        };
        const gridlines = this.svg.selectAll("line").data(c.scale.ticks(count));
        gridlines.exit().remove();          // remove unneeded circles
        gridlines.enter().append('line')    // add new circles
        .attr(`${c.dim.fix}1`, c.range.min)
        .attr(`${c.dim.fix}2`, c.range.max);
        gridlines.transition().duration(1000)
        .attr(`${c.dim.var}1`, d => c.scale(<number>d))
        .attr(`${c.dim.var}2`, d => c.scale(<number>d));
    }
}