/**
 * # Grid class
 * 
 */

 /** */
import { Data }             from 'hsdatab';
import { log as gLog }      from 'hsutil';   const log = gLog('d3.Grid');
import { GraphComponent }   from './GraphComponent'; 
import { GraphCfg }         from './ConfigTypes';
import { d3Base }           from './ConfigTypes';
import * as d3Axis          from "d3-axis";
import { Direction }       from './Axis';
 
export enum MajorMinor {
    major   = 'major',
    minor   = 'minor'
}

export class Grid extends GraphComponent {
    private svg: d3Base;
    private hor: boolean;
 
    constructor(cfg:GraphCfg, protected dir:Direction, protected type=MajorMinor.major) {
        super(cfg);
        const baseClass = `${dir}-${type}-Grid`;
        this.hor = this.dir===Direction.Horizontal;
        this.svg = cfg.baseSVG.select('.grid').append('g').classed(baseClass, true);
    }
 
    render() {
        const count = this.type===MajorMinor.major? 2 : 10;
        const scales = this.config.defaults.scales;
        const scaleX = this.config.scales.hor.scale;
        const scaleY = this.config.scales.ver.scale;
        const style = this.config.defaults.grid[this.dir][this.type];
        this.svg
            .attr('stroke', style.color)
            .attr('stroke-width', style.width)
            .attr('stroke-opacity', style.opacity);
        const c = {
            range:  this.hor? scales.hor.range : scales.ver.range,
            scale:  this.hor? scaleY : scaleX,  
            dim:    this.hor? { fix:'x', var:'y'} : { fix:'y', var:'x'},
            // ticks:  (this.hor? scaleY : scaleX).ticks(count)
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