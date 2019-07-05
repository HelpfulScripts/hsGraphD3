/**
 * # Bubble Plot
 */

import { log as gLog }      from 'hsutil';   const log = gLog('d3.bubble');
import * as d3              from "d3";
import { Data, DataRow }    from 'hsdatab';
import { NumDomain }        from 'hsdatab';
import { PlotCfg }          from './ConfigTypes';
import { PlotFnDef }        from './ConfigTypes';

const DEF_RADIUS:number = 5;

/**
 * bubble chart: 
 * @param data a {@link hsDatab:Data `Data`} object containing the 
 * @param cx string column name for x-center coordinates
 * @param cy string column name for y-center coordinates
 * @param r  string column name for radius coordinates
 */
export const bubble:PlotFnDef = (data:Data, desc: PlotCfg, cx:string, cy:string, r?:string) => {
    const ix = data.colNumber(cx);
    const iy = data.colNumber(cy);
    const ir = data.colNumber(r);
    const scaleX = desc.cfg.scales.hor.scale;
    const scaleY = desc.cfg.scales.ver.scale;
    const defR = desc.cfg.defaults.Scales(r);
    const scaleR = d3.scaleLinear().domain(<NumDomain>data.findDomain(r)).range([defR.range.min, defR.range.max]);
    const svg = desc.cfg.baseSVG;
    const circles = svg.selectAll("circle").data(data.getData());
        
    circles.exit().remove();            // remove unneeded circles
    circles.enter().append('circle');   // add new circles
    
    circles.transition().duration(1000)
        .attr("cx", d => scaleX(<number>d[ix]))
        .attr("cy", d => scaleY(<number>d[iy]))
        .attr("r",  d => scaleR(ir===undefined? DEF_RADIUS : <number>d[ir]))
        .attr('fill', (d,i) => ['#f00', '#0f0', '#00f', '#ff0', '#f0f', '#0ff'][i])
        ;        
};

