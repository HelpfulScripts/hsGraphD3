/**
 * # Axis class
 * 
 * ### Axes Default Settings:
 * <example height=300px libs={hsGraphD3:'hsGraphD3', hsUtil:'hsUtil'}>
 * <file name='script.js'>
 * const log = new hsUtil.Log('');
 * let defaults;
 * 
 * m.mount(root, {
 *   view:() => m('div', {style:'background-color:#eee; font-family:Monospace'}, [
 *      m('div', m.trust('graph.axes.defaults = ' + defaults)), 
 *      m('div.myGraph', '')
 *   ]),
 *   oncreate: () => {
 *      const svgRoot = root.getElementsByClassName('myGraph');
 *      if (svgRoot && svgRoot.length && !defaults) { 
 *          const colors = ['#800', '#080', '#008'];
 *          defaults = log
 *              .inspect(new hsGraphD3.GraphCartesian(svgRoot[0]).defaults.axes, null, '   ', colors)
 *              .replace(/\n/g, '<br>')
 *      }
 *   } 
 * });
 * </file>
 * </example>
 */

/** */
import { format }           from 'd3';
import { Log }              from 'hsutil'; const log = new Log('Axis');
import { GraphComponent }   from './GraphComponent'; 
import { GraphCfg }         from './GraphComponent';
import { ComponentDefaults }from './GraphComponent';
import { ScaleDims }        from './Scale';
import { ScalesDefaults }   from './Scale';
import { UnitVp }           from './Settings';
import { d3Base }           from './Settings';
import { setText }          from './Settings';
import { setStroke }        from './Settings';
import { defaultLine }      from './Settings';
import { defaultText }      from './Settings';
import { Line }             from './Settings';
import { Text }             from './Settings';
import { DataVal }          from './Graph';


const pixPerMajorTick = 200;
const pixPerMinorTick =  50;

export enum Direction {
    horizontal  = 'hor',
    vertical    = 'ver'
}

export interface AxisDefaults extends ComponentDefaults {
    color:      string;
    rendered:   boolean;
    line:       Line;
    tickWidth:  UnitVp;
    tickMarks:  Line;
    tickLabel:  Text;
    crossing:   string|number|Date|'auto';
    numTicksMajor: 'auto' | number;
    numTicksMinor: 'auto' | number;

}

export interface AxesDefaults extends ComponentDefaults {
    color:      string;
    rendered:   boolean;
    hor:        AxisDefaults;
    ver:        AxisDefaults;
} 


export class Axes extends GraphComponent {
    static type = 'axes';

    private axes: Axis[] = [];

    constructor(cfg:GraphCfg) {
        super(cfg, Axes.type);
        this.axes.push(new Axis(this, cfg, Direction.horizontal));
        this.axes.push(new Axis(this, cfg, Direction.vertical));
    }

    public get componentType() { return Axes.type; }

    public get defaults():AxesDefaults { return this.cfg.graph.defaults.axes; }

    public createDefaults():AxesDefaults {
        return {
            color:  '#000',
            rendered: true,
            hor:    this.axes[0].createDefaults(),
            ver:    this.axes[1].createDefaults()
        };
    }

    initialize(svg:d3Base): void {
    } 

    preRender(): void {
        const def = this.defaults;
        if (def.rendered) {
            this.axes.forEach(axis => axis.defaults.rendered? axis.preRender() : '');
        }
    } 

    renderComponent() {
        const def = this.defaults;
        if (def.rendered) {
            this.axes.forEach(axis => axis.defaults.rendered? axis.renderComponent() : '');
        }
    }
    postRender(): void {} 
}

export class Axis {
    private pos: string;    // left/right or top/bottom
    private svg: d3Base;

    constructor(private axes:Axes, private cfg:GraphCfg, private dir:Direction) {
        this.svg = cfg.baseSVG.select('.axes').append('g');
        this.svg.classed(`${dir}Axis`, true);
    }

    public createDefaults():AxisDefaults {
        return {
            color:          'currentColor',
            rendered:       true,
            line:           defaultLine(1),
            tickWidth:      5,
            tickMarks:      defaultLine(2),
            tickLabel:      defaultText(),
            crossing:       'auto',
            numTicksMajor:  'auto',
            numTicksMinor:  'auto',
        };
    }

    public get defaults():AxisDefaults { return this.axes.defaults[this.dir]; }
    
    preRender(): void {
        const axisDef = this.defaults;
        const scales = this.cfg.graph.scales.scaleDims;
        const scale = scales[this.dir];
        const clientSize = (this.dir===Direction.horizontal)? this.cfg.client.width : this.cfg.client.height;
        scale.tickCountMajor = axisDef.numTicksMajor==='auto'? parseInt(''+(clientSize / pixPerMajorTick)) : axisDef.numTicksMajor;
        scale.tickCountMinor = axisDef.numTicksMinor==='auto'? parseInt(''+(clientSize / pixPerMinorTick)) : axisDef.numTicksMinor;
        // if (this.dir==='ver') { log.info(`ticks: ${this.dir}:${scale.tickCountMajor}/${scale.tickCountMinor}, size = ${clientSize}`); }
    } 

    public renderComponent() {
        const trans = this.cfg.transition;
        const axisDef = this.defaults;
        this.cfg.baseSVG.select('.axes')
            .attr('color', this.defaults.color);

        setStroke(this.svg, axisDef.line);
        const scales = this.cfg.graph.scales.scaleDims;
        this.setTransform(scales);
        const axis:any = this.getD3Axis(scales, axisDef);
        const scale = scales[this.dir];
        axis.ticks(scale.tickCountMinor);
        this.svg.transition(trans).call(axis);

        this.svg.attr('color', axisDef.color);
        if (!axisDef.line.rendered) {
            this.svg.selectAll('path').attr('style', 'visibility: hidden');
        }
        if (axisDef.tickLabel.rendered) {
            setText(this.svg, axisDef.tickLabel, trans);
        } else {
            this.svg.selectAll('text').attr('style', 'visibility: hidden');
        }
        if (axisDef.tickMarks.rendered) {
            setStroke(this.svg.selectAll('.tick line'), axisDef.tickMarks);
        } else {
            this.svg.selectAll('.tick line').attr('style', 'visibility: hidden');
        }
    }

    setTransform(scales:ScaleDims) {
        const margins = this.cfg.graph.scales.defaults.margin;
        const trans = this.cfg.transition;
        const orth = (this.dir===Direction.horizontal)? Direction.vertical : Direction.horizontal;
        const scale = scales[this.dir];
        const oscale = scales[orth];
        const axisDef = this.cfg.graph.axes.defaults[orth];
        const dom = oscale.domain();
        const cross:DataVal = axisDef.crossing==='auto'? ((dom[0] < 0 && dom[1] > 0)? 0 : dom[0]) : axisDef.crossing;
        let crossing = oscale(cross);
        const d = scale.type()==='ordinal'? scale.paddingInner()*scale.step()/2 : 0;
        if (this.dir===Direction.horizontal) {
            this.pos = 'bottom';
            if (crossing < margins.top) {
                crossing = margins.top;
            } else if (crossing > this.cfg.viewPort.height-margins.bottom) {
                crossing = this.cfg.viewPort.height-margins.bottom;
                this.pos = 'top';
            }
            crossing += ((oscale.type()==='ordinal')? oscale.step() : 0);
            this.svg.transition(trans).attr("transform", `translate(${d}, ${crossing})`);
        } else {
            this.pos = 'left';
            if (crossing < margins.left) {
                crossing = margins.left;
                this.pos = 'right';
            } else if (crossing > this.cfg.viewPort.width-margins.right) {
                crossing = this.cfg.viewPort.width-margins.right;
            }
            this.svg.transition(trans).attr("transform", `translate(${crossing}, ${d})`);
        }
    }

    getD3Axis(scales:ScaleDims, axisDef:AxisDefaults) {
        let axis:d3.Axis<d3.AxisDomain>;
        if (this.dir===Direction.horizontal) {
            axis = scales.hor.axis(this.pos);
            if (scales.hor.type() === 'number') { axis.tickFormat(format('~g')); }
        } else {
            axis = scales.ver.axis(this.pos);
            if (scales.ver.type() === 'number') { axis.tickFormat(format('~g')); }
        }
        axis.tickSize(axisDef.tickWidth);
        return axis;
    }
}