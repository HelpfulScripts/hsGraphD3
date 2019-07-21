/**
 * # Bubble Plot
 */

import { log as gLog }      from 'hsutil';   const log = gLog('d3.bubble');
import * as d3              from "d3";
import { Data }             from 'hsdatab';
import { NumDomain }        from 'hsdatab';
import { PlotCfg }          from '../ConfigTypes';
import { Plot, PlotClass }  from '../Plot';
import { PlotFactory }      from '../Plot';
import { d3Selection }      from '../Plot';

const DEF_RADIUS:number = 5;

export class BubbleFatory extends PlotFactory {
    newPlot(desc:PlotCfg, cx:string, cy:string, r?:string): PlotClass {
        return new Bubble(desc, cx, cy, r);
    }
}

class Bubble extends PlotClass {
    /**
     * plot constructor
     * @param cx string column name for x-center coordinates
     * @param cy string column name for y-center coordinates
     * @param r  string column name for radius coordinates
     */
    constructor(protected desc: PlotCfg, protected cx:string, protected cy:string, protected r?:string) {
        super(desc, cx, cy);
        desc.cfg.defaults.scales[r] = desc.cfg.defaults.scales[r] || desc.cfg.defaults.defaultScale();
    }

    /**
     * 
     * @param data a {@link hsDatab:Data `Data`} object containing the 
     */
    render(data:Data, series:d3Selection) {  
        const ix = data.colNumber(this.cx);
        const iy = data.colNumber(this.cy);
        const ir = data.colNumber(this.r);
        const scaleX = this.desc.cfg.scales.hor.scale;
        const scaleY = this.desc.cfg.scales.ver.scale;
        const defR = this.desc.cfg.defaults.scales[this.r];
        const scaleR = d3.scaleLinear().domain(<NumDomain>data.findDomain(this.r)).range([defR.range.min, defR.range.max]);
        const circles = series.selectAll("circle").data(data.getData());
            
        circles.exit().remove();            // remove unneeded circles
        circles.enter().append('circle');   // add new circles
        
        circles.transition().duration(1000)
            .attr("cx", d => scaleX(<number>d[ix]))
            .attr("cy", d => scaleY(<number>d[iy]))
            .attr("r",  d => scaleR(ir===undefined? DEF_RADIUS : <number>d[ir]))
            .attr('fill', (d,i) => ['#f00', '#0f0', '#00f', '#ff0', '#f0f', '#0ff'][i])
            ;        
    }
} 

console.log('registering Bubble');
Plot.register('bubble', new BubbleFatory());
