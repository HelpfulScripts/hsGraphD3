/**
 * # Grid class
 * 
 */

 /** */
import { log as gLog }      from 'hsutil';   const log = gLog('Grid');
import { GraphComponent }   from './GraphComponent'; 
import { ComponentDefaults }from './GraphComponent'; 
import { GraphCfg }         from './GraphComponent';
import { SVGLineSelection } from './GraphComponent';
import { d3Base }           from './Settings';
import { Stroke }             from './Settings';
import { defaultStroke }      from './Settings';
import { setStroke }        from './Settings';
import { Direction }        from './Axis';
 

export enum MajorMinor {
    major   = 'major',
    minor   = 'minor'
}

export interface GridDefaults extends ComponentDefaults {
    hor: {
        major: Stroke;
        minor: Stroke;
    };
    ver: {
        major: Stroke;
        minor: Stroke;
    };
} 

export class Grids extends GraphComponent {
    static type = 'grids';

    private grids = {
        hor: { major: <Grid>undefined, minor: <Grid>undefined },
        ver: { major: <Grid>undefined, minor: <Grid>undefined }
    };
    constructor(cfg:GraphCfg) {
        super(cfg, Grids.type);
    }

    get componentType() { return Grids.type; }

    public createDefaults():GridDefaults {
        return {
            hor: {
                major: defaultStroke(1,'#444'),
                minor: defaultStroke(1, '#eee')
            },
            ver: {
                major: defaultStroke(1,'#444'),
                minor: defaultStroke(1, '#eee')
            }
        };
    }

    initialize(svg:d3Base): void {
        this.grids['hor']['major'] = new Grid(this.cfg, Direction.horizontal, MajorMinor.major);
        this.grids['hor']['minor'] = new Grid(this.cfg, Direction.horizontal, MajorMinor.minor);
        this.grids['ver']['major'] = new Grid(this.cfg, Direction.vertical, MajorMinor.major);
        this.grids['ver']['minor'] = new Grid(this.cfg, Direction.vertical, MajorMinor.minor);
    } 

    preRender(): void {
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
        const trans = this.cfg.transition;
        const count = this.type===MajorMinor.major? 2 : 10;
        const scales = this.cfg.defaults.scales.dims;
        const scaleX = this.cfg.scales.hor;
        const scaleY = this.cfg.scales.ver;
        const style = this.cfg.defaults.grids[this.dir][this.type];
        setStroke(this.svg, style);
        const c = {
            range:  this.hor? scaleX.range() : scaleY.range(),
            scale:  this.hor? scaleY : scaleX,  
                    // 'fix' variable: the span of the gridline, doesn't change
                    // 'var' variable: the grid line's axis intercept, chenges with scale
            dim:    this.hor? { fix:'x', var:'y'} : { fix:'y', var:'x'}
        };
        const gridlines:SVGLineSelection = <SVGLineSelection>this.svg.selectAll("line").data(c.scale.ticks(count));
        gridlines.exit().remove();          // remove unneeded circles
        gridlines.enter().append('line')    // add new circles
            .attr(`${c.dim.fix}1`, c.range[0])
            .attr(`${c.dim.fix}2`, c.range[1])
        .merge(gridlines).transition(trans)
            .attr(`${c.dim.var}1`, d => c.scale(<number>d))
            .attr(`${c.dim.var}2`, d => c.scale(<number>d));
    }
}