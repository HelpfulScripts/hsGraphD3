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

const axisWidth:number = 50;    // the space needed next to the axis for printing tick labels
const tickWidth:number = 10;

export enum Direction {
    horizontal  = 'hor',
    vertical    = 'ver'
}

export interface AxisDefaults extends ComponentDefaults {
    color:      string;
    line:       def.Line;
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
        this.axes.push(new Axis(cfg, Direction.horizontal));
        this.axes.push(new Axis(cfg, Direction.vertical));
    }

    public get componentType() { return 'axes'; }

    public createDefaults() {
        def.Defaults.addComponentDefaults(this.componentType, <AxesDefaults>{
            color:          '#000',
            hor: {
                color:      'currentColor',
                line:       def.defaultLine(2),
                tickMarks:  def.defaultLine(2),
                tickLabel:  def.defaultText()
            },
            ver: {
                color:      'currentColor',
                line:       def.defaultLine(2),
                tickMarks:  def.defaultLine(2),
                tickLabel:  def.defaultText()
            }
        });
    }
    
    public renderComponent() {
        this.axes.forEach(axis => axis.renderComponent());
    }
}


export class Axis extends GraphComponent {
    private dir: Direction;

    constructor(cfg:GraphCfg, dir:Direction) {
        super(cfg, cfg.baseSVG.select('.axes').append('g'));
        this.dir = dir;
        this.svg.classed(`${dir}Axis`, true);
    }

    public get componentType() { return 'axis'; }

    public createDefaults() {}
    
    public renderComponent() {
        const scales = this.cfg.scales;
        const style = this.cfg.defaults('axes')[this.dir];
        let axis;
        this.cfg.baseSVG.select('.axes')
            .attr('color', (<AxesDefaults>this.cfg.defaults('axes')).color);
        this.svg
            .attr('stroke', style.line.color)
            .attr('stroke-width', style.line.width)
            .attr('stroke-opacity', style.line.opacity);

        if (this.dir===Direction.horizontal) {
            axis = d3.axisTop(scales.hor.scale);
            const yCrossing = Math.max(axisWidth, Math.min(scales.ver.scale(0), this.cfg.viewPort.height-axisWidth));
            this.svg.attr("transform", `translate(0, ${yCrossing})`);
        } else {
            axis = d3.axisRight(scales.ver.scale);
            const xCrossing = Math.max(axisWidth, Math.min(scales.hor.scale(0), this.cfg.viewPort.width-axisWidth));
            this.svg.attr("transform", `translate(${xCrossing}, 0)`);
        }
        axis.tickSize(tickWidth);
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