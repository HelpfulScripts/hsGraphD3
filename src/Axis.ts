/**
 * # Axis class
 * 
 * ### Axes Default Settings:
 * <example height=300px libs={hsGraphD3:'hsGraphD3', hsUtil:'hsUtil'}>
 * <file name='script.js'>
 * const log = hsUtil.log('');
 * let defaults;
 * 
 * m.mount(root, {
 *   view:() => m('div', {style:'background-color:#eee; font-family:Monospace'}, [
 *      m('div', m.trust('graph.defaults.axes = ' + defaults)), 
 *      m('div.myGraph', '')
 *   ]),
 *   oncreate: () => {
 *      const svgRoot = root.getElementsByClassName('myGraph');
 *      if (svgRoot && svgRoot.length && !defaults) { 
 *          const colors = ['#800', '#080', '#008'];
 *          defaults = hsUtil.log
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
import { log as gLog }      from 'hsutil';   const log = gLog('Axis');
import { GraphComponent }   from './GraphComponent'; 
import { GraphCfg }         from './GraphComponent';
import { ComponentDefaults }from './GraphComponent';
import { Line }             from './GraphComponent';
import { Text }             from './GraphComponent';
import * as def             from './Settings';
import { ScaleDims }        from './Scale';
import { ScalesDefaults }   from './Scale';
import { UnitVp, d3Base }   from './Settings';
import { setText }          from './Settings';
import { setStroke }        from './Settings';
import { DataVal }          from './Graph';

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
        this.axes.push(new Axis(this.cfg, Direction.horizontal));
        this.axes.push(new Axis(this.cfg, Direction.vertical));
    }

    public get componentType() { return Axes.type; }

    public createDefaults():AxesDefaults {
        return {
            color:  '#000',
            rendered: true,
            hor:    this.axes[0].createDefaults(),
            ver:    this.axes[1].createDefaults()
        };
    }

    initialize(svg:def.d3Base): void {
    } 

    preRender(): void {} 

    renderComponent() {
        const def = <AxesDefaults>this.cfg.defaults.axes;
        if (def.rendered) {
            this.axes.forEach(axis => axis.defaults.rendered? axis.renderComponent() : '');
        }
    }
    postRender(): void {} 
}


export class Axis {
    private dir: Direction;
    private pos: string;    // left/right or top/bottom
    private cfg: GraphCfg;
    private svg: d3Base;

    constructor(cfg:GraphCfg, dir:Direction) {
        this.cfg = cfg;
        this.svg = cfg.baseSVG.select('.axes').append('g');
        this.dir = dir;
        this.svg.classed(`${dir}Axis`, true);
    }

    public createDefaults():AxisDefaults {
        return {
            color:      'currentColor',
            rendered:   true,
            line:       def.defaultLine(1),
            tickWidth:  5,
            tickMarks:  def.defaultLine(2),
            tickLabel:  def.defaultText(),
            crossing:   'auto'
        };
    }

    public get defaults():AxisDefaults {
        return (<AxisDefaults>this.cfg.defaults.axes)[this.dir];
    }
    
    public renderComponent() {
        const trans = this.cfg.transition;
        const axisDef = <AxisDefaults>this.cfg.defaults.axes[this.dir];
        this.cfg.baseSVG.select('.axes')
            .attr('color', this.cfg.defaults.axes.color);

        setStroke(this.svg, axisDef.line);
        this.setTransform(this.cfg.scales);
        const axis:any = this.getD3Axis(this.cfg.scales, axisDef);
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
        const margins = (<ScalesDefaults>this.cfg.defaults.scales).margin;
        const trans = this.cfg.transition;
        if (this.dir===Direction.horizontal) {
            const axisDef = <AxisDefaults>this.cfg.defaults.axes.ver;
            const dom = scales.ver.domain();
            const cross:DataVal = axisDef.crossing==='auto'? ((dom[0] < 0 && dom[1] > 0)? 0 : dom[0]) : axisDef.crossing;
            let yCrossing = scales.ver(cross) + ((scales.ver.type()==='ordinal')? scales.ver.step() : 0);
            this.pos = 'bottom';
            if (yCrossing < margins.top) {
                yCrossing = margins.top;
            } else if (yCrossing > this.cfg.viewPort.height-margins.bottom) {
                yCrossing = this.cfg.viewPort.height-margins.bottom;
                this.pos = 'top';
            }
            const dx = scales.hor.type()==='ordinal'? scales.hor.paddingOuter()*scales.hor.step()/2 : 0;
            this.svg.transition(trans).attr("transform", `translate(${dx}, ${yCrossing})`);
        } else {
            const axisDef = <AxisDefaults>this.cfg.defaults.axes.hor;
            const dom = scales.hor.domain();
            const cross:DataVal = axisDef.crossing==='auto'? ((dom[0] < 0 && dom[1] > 0)? 0 : dom[0]) : axisDef.crossing;
            let xCrossing = scales.hor(cross);
            this.pos = 'left';
            if (xCrossing < margins.left) {
                xCrossing = margins.left;
                this.pos = 'right';
            } else if (xCrossing > this.cfg.viewPort.width-margins.right) {
                xCrossing = this.cfg.viewPort.width-margins.right;
            }
            const dy = scales.ver.type()==='ordinal'? scales.ver.paddingOuter()*scales.ver.step()/2 : 0;
            this.svg.transition(trans).attr("transform", `translate(${xCrossing}, ${dy})`);
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