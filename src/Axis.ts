/**
 * # Axis class
 * 
 */

 /** */
import { Data }             from 'hsdatab';
import { log as gLog }      from 'hsutil';   const log = gLog('d3.Axis');
import { GraphComponent }   from './GraphComponent'; 
import { GraphCfg }         from './ConfigTypes';
import { d3Base }           from './ConfigTypes';
import * as d3Axis          from "d3-axis";

const axisWidth:number = 50;    // the space needed next to the axis for printing tick labels
const tickWidth:number = 10;

export enum Direction {
    Horizontal  = 'hor',
    Vertical    = 'ver'
}

export class Axis extends GraphComponent {
    private dir: Direction;
    private svg: d3Base;

    constructor(cfg:GraphCfg, dir:Direction) {
        super(cfg);
        this.dir = dir;
        this.svg = cfg.baseSVG.select('.axes').append('g').classed(`${dir}Axis`, true);
    }

    render() {
        const scales = this.config.scales;
        const style = this.config.defaults.axes[this.dir];
        let axis;
        this.svg
            .attr('stroke', style.line.color)
            .attr('stroke-width', style.line.width)
            .attr('stroke-opacity', style.line.opacity);

        if (this.dir===Direction.Horizontal) {
            const yCrossing = Math.max(axisWidth, Math.min(scales.ver.scale(0), this.config.viewPort.height-axisWidth));
            const horCol = scales.hor.dataCol;
            axis = d3Axis.axisTop(scales.hor.scale);
            this.svg.attr("transform", `translate(0, ${yCrossing})`);
        } else {
            const xCrossing = Math.max(axisWidth, Math.min(scales.hor.scale(0), this.config.viewPort.width-axisWidth));
            axis = d3Axis.axisRight(scales.ver.scale);
            this.svg.attr("transform", `translate(${xCrossing}, 0)`);
        }
        axis.tickSize(tickWidth);
        this.svg.call(axis);
        this.svg.selectAll('text').transition().duration(1000)
            .attr('style', `font-family:${style.tickLabel.font.family}; font-size:${style.tickLabel.font.size}px; font-style:${style.tickLabel.font.style}; font-weight:${style.tickLabel.font.weight};`);
    }
}