/**
 * # Bubble Plot
 */

import { log as gLog }      from 'hsutil';   const log = gLog('Bubble');
import * as d3              from "d3";
import { Data }             from 'hsdatab';
import { NumDomain }        from 'hsdatab';
import { SeriesPlot }       from '../SeriesPlot';
import { SeriesDefaults }   from '../SeriesPlot';
import { Series }           from '../Plot';
import { d3Base }           from '../ConfigTypes';
import { GraphCfg }         from '../GraphComponent'; 
import * as def             from '../Defaults';
import { defaultDimScale}   from '../Scale';
import { ScaleDefaults}     from '../Scale';

const DEF_RADIUS:number = 5;

class Bubble extends SeriesPlot {
    /**
     * plot constructor
     * @param cx string column name for x-center coordinates
     * @param cy string column name for y-center coordinates
     * @param r  string column name for radius coordinates
     */
    constructor(cfg:GraphCfg, svgBase:d3Base, protected cx:string, protected cy:string, protected r?:string) {
        super(cfg, svgBase, cx, cy);
        const scales = (<ScaleDefaults>cfg.defaults('scales')).dims;
        scales[r] = scales[r] || defaultDimScale();
    }

    getDefaults(): SeriesDefaults {
        return {
            line:   def.defaultLine(1),
            marker: {
                size:   5,
                shape:  'circle',
                fill:   {
                    color: '#F00',
                    opacity: 1             
                },
                stroke: def.defaultLine(1)
            }
        };
    }
    
    /**
     * 
     * @param data a {@link hsDatab:Data `Data`} object containing the 
     */
    renderComponent(data:Data) {  
        const ix = data.colNumber(this.cx);
        const iy = data.colNumber(this.cy);
        const ir = data.colNumber(this.r);
        const scaleX = this.cfg.scales.hor.scale;
        const scaleY = this.cfg.scales.ver.scale;
        const defR = (<ScaleDefaults>this.cfg.defaults('scales')).dims[this.r];
        const scaleR = d3.scaleLinear().domain(<NumDomain>data.findDomain(this.r)).range([defR.range.min, defR.range.max]);
        const circles = this.svg.selectAll("circle").data(data.getData());
            
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

//Plot.register('bubble', new BubbleFatory());
Series.register('bubble', (cfg:GraphCfg, svgBase:d3Base, cx:string, cy:string, r?:string) => new Bubble(cfg, svgBase, cx, cy, r));
