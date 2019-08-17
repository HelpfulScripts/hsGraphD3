/**
 * # Bubble Plot
 */

import { log as gLog }          from 'hsutil';   const log = gLog('Bubble');
import { line as d3line}        from "d3";
import { Line as d3Line }       from "d3";
import { interpolate }          from "d3";
import { Data }                 from 'hsdatab';
import { SeriesPlot }           from '../SeriesPlot';
import { SeriesPlotDefaults }   from '../SeriesPlot';
import { Series }               from '../Series';
import { d3Base }               from '../Settings';
import { GraphCfg }             from '../GraphComponent'; 
import * as def                 from '../Settings';


class Line extends SeriesPlot {
    line: d3Line<number[]>;

    /**
     * plot constructor
     * @param cx string column name for x-center coordinates
     * @param cy string column name for y-center coordinates
     */
    constructor(cfg:GraphCfg, seriesName:string, protected cx:string, protected cy:string) {
        super(cfg, seriesName, cx, cy);
    }

    getDefaults(): SeriesPlotDefaults {
        return {
            line:   def.defaultLine(1),
            marker: {
                size:   20,
                shape:  'circle',
                fill:   {
                    color: '#F00',
                    opacity: 1             
                },
                stroke: def.defaultLine(1)
            }
        };
    }
    
    initialize(svg:d3Base): void {
        super.initialize(svg);
    } 

    /**
     * render the `Line` plot
     * @param data a {@link hsDatab:Data `Data`} object containing the data to plot
     */
    renderComponent(data:Data) {  
        const defaults = this.cfg.defaults.series[this.key];

        this.renderPath(data, defaults);
        this.renderMarkers(data, defaults);
    }

    renderPath(data:Data, defaults:SeriesPlotDefaults) {
        const ix = this.cols[0];
        const iy = this.cols[1];
        const scaleX = this.cfg.scales.hor;
        const scaleY = this.cfg.scales.ver;
        this.line = d3line()
            .x(d => scaleX(d[ix]))
            .y(d => scaleY(d[iy]))
            // .curve("linear")
            ;
        const path = this.svg.selectAll('path').data([1]);
        path.enter().append('path')
            .attr('stroke', defaults.line.color)
            .attr('stroke-width', defaults.line.width)
            .attr('fill-opacity', 0);
        path.exit().remove();            // remove unneeded circles
        path.transition(def.d3Transition)
            .attr('d', this.line(<number[][]>data.getData()));
    }

    renderMarkers(data:Data, defaults:SeriesPlotDefaults) {
        const ix = this.cols[0];
        const iy = this.cols[1];
        const scaleX = this.cfg.scales.hor;
        const scaleY = this.cfg.scales.ver;
        const samples = this.svg.selectAll("circle").data(data.getData());
        samples.exit().remove();            // remove unneeded circles
        samples.enter().append('circle');   // add new circles
        // draw markers
        samples.transition(def.d3Transition)
            .attr("cx", (d:number[]) => scaleX(<number>d[ix]))
            .attr("cy", (d:number[]) => scaleY(<number>d[iy]))
            .attr("r",  defaults.marker.size)
            .attr('fill', defaults.marker.fill.color);        
    }
} 

Series.register('line', (cfg:GraphCfg, sName:string, cx:string, cy:string) => new Line(cfg, sName, cx, cy));
