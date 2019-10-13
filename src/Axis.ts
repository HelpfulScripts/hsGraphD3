/**
 * # Axis class
 * 
 */

/** */
import { axisTop }          from 'd3';
import { axisRight }        from 'd3';
import { format }           from 'd3';
import { log as gLog }      from 'hsutil';   const log = gLog('Axis');
import { GraphComponent }   from './GraphComponent'; 
import { GraphCfg }         from './GraphComponent';
import { ComponentDefaults }from './GraphComponent';
import { Line }             from './GraphComponent';
import { Text }             from './GraphComponent';
import * as def             from './Settings';
import { ScalesDefaults }   from './Scale';
import { UnitVp, d3Base }   from './Settings';
import { setText }          from './Settings';
import { setStroke }        from './Settings';

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

    preRender(): void {
    } 

    renderComponent() {
        const def = <AxesDefaults>this.cfg.defaults.axes;
        if (def.rendered) {
            this.axes.forEach(axis => axis.defaults.rendered? axis.renderComponent() : '');
        }
    }
}


export class Axis {
    private dir: Direction;
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
            tickLabel:  def.defaultText()
        };
    }

    public get defaults():AxisDefaults {
        return (<AxisDefaults>this.cfg.defaults.axes)[this.dir];
    }
    
    public renderComponent() {
        const trans = this.cfg.transition;
        const horScales = this.cfg.scales.hor;
        const verScales = this.cfg.scales.ver;
        const style = <AxisDefaults>this.cfg.defaults.axes[this.dir];
        let axis:any;
        const margins = (<ScalesDefaults>this.cfg.defaults.scales).margin;
        this.cfg.baseSVG.select('.axes')
            .attr('color', this.cfg.defaults.axes.color);

        setStroke(this.svg, style.line);

        if (this.dir===Direction.horizontal) {
            axis = axisTop(horScales);
            const yCrossing = Math.max(margins.left, Math.min(verScales(0), this.cfg.viewPort.height-margins.right));
            this.svg.transition(trans).attr("transform", `translate(0, ${yCrossing})`);
        } else {
            axis = axisRight(verScales);
            const xCrossing = Math.max(margins.top, Math.min(horScales(0), this.cfg.viewPort.width-margins.bottom));
            this.svg.transition(trans).attr("transform", `translate(${xCrossing}, 0)`);
        }
        axis.tickSize(style.tickWidth);
        axis.tickFormat(format('~g'));
        this.svg.attr('color', style.color);
        this.svg.transition(trans).call(axis);
        if (style.line.rendered) {
        } else {
            this.svg.selectAll('path').attr('style', 'visibility: hidden');
        }
        if (style.tickLabel.rendered) {
            setText(this.svg, style.tickLabel, trans);
        } else {
            this.svg.selectAll('text').attr('style', 'visibility: hidden');
        }
        if (style.tickMarks.rendered) {
            setStroke(this.svg.selectAll('.tick line'), style.tickMarks);
        } else {
            this.svg.selectAll('.tick line').attr('style', 'visibility: hidden');
        }
    }
}