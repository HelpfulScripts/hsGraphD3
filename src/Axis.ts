/**
 * # Axis class
 * 
 */

 /** */
 import * as d3             from 'd3';
import { log as gLog }      from 'hsutil';   const log = gLog('Axis');
import { GraphComponent }   from './GraphComponent'; 
import { GraphCfg }         from './GraphComponent';
import { ComponentDefaults }from './GraphComponent';
import * as def             from './Defaults';
import { ScaleDefaults }    from './Scale';
import { UnitVp, d3Base }   from './ConfigTypes';


export enum Direction {
    horizontal  = 'hor',
    vertical    = 'ver'
}

export interface AxisDefaults extends ComponentDefaults {
    color:      string;
    line:       def.Line;
    tickWidth:  UnitVp;
    tickMarks:  def.Line;
    tickLabel:  def.TextStyle;
}

export interface AxesDefaults extends ComponentDefaults {
    color:      string;
    hor:        AxisDefaults;
    ver:        AxisDefaults;
} 


export class Axes extends GraphComponent {
    private axes: Axis[] = [];

    constructor(cfg:GraphCfg) {
        super(cfg, cfg.baseSVG.select('.axes'));
        let axis;
        this.axes.push(new Axis(cfg, Direction.horizontal));
        this.axes.push(new Axis(cfg, Direction.vertical));
    }

    public get componentType() { return 'axes'; }

    public createDefaults():AxesDefaults {
        return {
            color:  '#000',
            hor:    this.axes[0].createDefaults(),
            ver:    this.axes[1].createDefaults()
        };
    }
    
    public renderComponent() {
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
            line:       def.defaultLine(2),
            tickWidth:  10,
            tickMarks:  def.defaultLine(2),
            tickLabel:  def.defaultText()
        };
    }
    
    public renderComponent() {
        const scales = this.cfg.scales;
        const style = this.cfg.defaults('axes')[this.dir];
        let axis;
        const margins = (<ScaleDefaults>this.cfg.defaults('scales')).margin;
        this.cfg.baseSVG.select('.axes')
            .attr('color', (<AxesDefaults>this.cfg.defaults('axes')).color);
        this.svg
            .attr('stroke', style.line.color)
            .attr('stroke-width', style.line.width)
            .attr('stroke-opacity', style.line.opacity);

        if (this.dir===Direction.horizontal) {
            axis = d3.axisTop(scales.hor.scale);
            const yCrossing = Math.max(margins.left, Math.min(scales.ver.scale(0), this.cfg.viewPort.height-margins.right));
            this.svg.attr("transform", `translate(0, ${yCrossing})`);
        } else {
            axis = d3.axisRight(scales.ver.scale);
            const xCrossing = Math.max(margins.top, Math.min(scales.hor.scale(0), this.cfg.viewPort.width-margins.bottom));
            this.svg.attr("transform", `translate(${xCrossing}, 0)`);
        }
        axis.tickSize(style.tickWidth);
        this.svg
            .attr('color', style.color)
            .style('font-family',  style.tickLabel.font.family)
            .style('font-size',   `${style.tickLabel.font.size}px`)
            .style('font-style',  style.tickLabel.font.style)
            .style('font-weight', style.tickLabel.font.weight);
        this.svg.call(axis);
        this.svg.selectAll('text')
            .transition().duration(1000)
            .attr('stroke', style.tickLabel.color || 'currentColor')
            .attr('stroke-width', 1);
        }
}