/**
 * # Axis class
 * 
 */

/** */
import { axisTop }          from 'd3';
import { axisRight }        from 'd3';
import { log as gLog }      from 'hsutil';   const log = gLog('Axis');
import { GraphComponent }   from './GraphComponent'; 
import { GraphCfg }         from './GraphComponent';
import { ComponentDefaults }from './GraphComponent';
import * as def             from './Settings';
import { ScalesDefaults }    from './Scale';
import { UnitVp, d3Base }   from './Settings';
import { setText }          from './Settings';
import { setStroke }        from './Settings';

export enum Direction {
    horizontal  = 'hor',
    vertical    = 'ver'
}

export interface AxisDefaults extends ComponentDefaults {
    color:      string;
    line:       def.Stroke;
    tickWidth:  UnitVp;
    tickMarks:  def.Stroke;
    tickLabel:  def.TextStyle;
}

export interface AxesDefaults extends ComponentDefaults {
    color:      string;
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
            hor:    this.axes[0].createDefaults(),
            ver:    this.axes[1].createDefaults()
        };
    }

    initialize(svg:def.d3Base): void {
    } 

    preRender(): void {
    } 

    renderComponent() {
        this.axes.forEach(axis => axis.renderComponent());
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

    public createDefaults() {
        return {
            color:      'currentColor',
            line:       def.defaultStroke(1),
            tickWidth:  5,
            tickMarks:  def.defaultStroke(2),
            tickLabel:  def.defaultText()
        };
    }
    
    public renderComponent() {
        const trans = this.cfg.transition;
        const horScales = this.cfg.scales.hor;
        const verScales = this.cfg.scales.ver;
        const style = this.cfg.defaults.axes[this.dir];
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
        setText(this.svg, style.tickLabel, trans);
        this.svg.attr('color', style.color);
        this.svg.transition(trans).call(axis);
        setStroke(this.svg.selectAll('text'), style.tickLabel);
    }
}