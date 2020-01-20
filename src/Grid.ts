/**
 * # Grid class
 * 
 * ### Grids Default Settings:
 * <example height=300px libs={hsGraphD3:'hsGraphD3', hsUtil:'hsUtil'}>
 * <file name='script.js'>
 * const log = new hsUtil.Log('');
 * let defaults;
 * 
 * m.mount(root, {
 *   view:() => m('div', {style:'background-color:#eee; font-family:Monospace'}, [
 *      m('div', m.trust('graph.grids.defaults = ' + defaults)), 
 *      m('div.myGraph', '')
 *   ]),
 *   oncreate: () => {
 *      const svgRoot = root.getElementsByClassName('myGraph');
 *      if (svgRoot && svgRoot.length && !defaults) { 
 *          const colors = ['#800', '#080', '#008'];
 *          defaults = log
 *              .inspect(new hsGraphD3.GraphCartesian(svgRoot[0]).defaults.grids, null, '   ', colors)
 *              .replace(/\n/g, '<br>')
 *      }
 *   } 
 * });
 * </file>
 * </example>
 */

 /** */
import { Log }              from 'hsutil'; const log = new Log('Grid');
import { GraphComponent }   from './GraphComponent'; 
import { ComponentDefaults }from './GraphComponent'; 
import { GraphCfg }         from './GraphComponent';
import { SVGLineSelection } from './GraphComponent';
import { Line }             from './Settings';
import { d3Base }           from './Settings';
import { defaultLine }      from './Settings';
import { setStroke }        from './Settings';
import { Direction }        from './Axis';
 

export enum MajorMinor {
    major   = 'major',
    minor   = 'minor'
}

export interface GridsDefaults extends ComponentDefaults {
    rendered: boolean;
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
    static type = 'grids';

    private grids = {
        hor: { major: <Grid>undefined, minor: <Grid>undefined },
        ver: { major: <Grid>undefined, minor: <Grid>undefined }
    };
    constructor(cfg:GraphCfg) {
        super(cfg, Grids.type);
    }

    public get componentType() { return Grids.type; }

    public get defaults():GridsDefaults { return this.cfg.graph.defaults.grids; }

    public createDefaults():GridsDefaults {
        return {
            rendered: true,
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

    public initialize(svg:d3Base): void {
        this.grids['hor']['major'] = new Grid(this.cfg, Direction.horizontal, MajorMinor.major);
        this.grids['hor']['minor'] = new Grid(this.cfg, Direction.horizontal, MajorMinor.minor);
        this.grids['ver']['major'] = new Grid(this.cfg, Direction.vertical, MajorMinor.major);
        this.grids['ver']['minor'] = new Grid(this.cfg, Direction.vertical, MajorMinor.minor);
    } 

    public preRender(): void {} 

    public renderComponent() {
        if (this.cfg.graph.defaults.grids.rendered) {
            this.grids['hor']['major'].renderComponent();
            this.grids['hor']['minor'].renderComponent();
            this.grids['ver']['major'].renderComponent();
            this.grids['ver']['minor'].renderComponent();    
        }
    }

    public postRender(): void {} 
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
        const style = this.cfg.graph.defaults.grids[this.dir][this.type];
        if (style.rendered) {
            const trans = this.cfg.transition;
            const scaleX = this.cfg.graph.scales.scaleDims.hor;
            const scaleY = this.cfg.graph.scales.scaleDims.ver;
            setStroke(this.svg, style);
            const c = this.hor? 
                { range:  scaleX.range(), scale:  scaleY,   dim: { fix:'x', var:'y'}}   // hor grid
              : { range:  scaleY.range(), scale:  scaleX,   dim: { fix:'y', var:'x'}};  // ver grid
            const count = this.type===MajorMinor.major? c.scale.tickCountMajor : c.scale.tickCountMinor;
            const gridlines:SVGLineSelection = <SVGLineSelection>this.svg.selectAll("line").data(c.scale.ticks(count), d => <any>d);
            gridlines.exit().remove();          // remove unneeded lines
            gridlines.enter().append('line')    // add new lines
                .attr(`${c.dim.fix}1`, c.range[0])
                .attr(`${c.dim.fix}2`, c.range[1])
                .attr(`${c.dim.var}1`, d => c.scale(<number>d))
                .attr(`${c.dim.var}2`, d => c.scale(<number>d))
            .merge(gridlines).transition(trans)
                .attr(`${c.dim.var}1`, d => c.scale(<number>d))
                .attr(`${c.dim.var}2`, d => c.scale(<number>d));
        }
    }
}