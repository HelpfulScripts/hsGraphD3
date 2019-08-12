

import { select as d3Select }   from 'd3'; 
import * as gc                  from './GraphComponent'; 
import * as def                 from './Defaults';

export interface CanvasDefaults extends gc.ComponentDefaults, def.RectStyle { }


export class Canvas extends gc.GraphComponent {
    constructor(cfg:gc.GraphCfg) {
        super(cfg, cfg.baseSVG.select('.canvas'));
        this.svg.append('rect').classed('.graphArea', true);
        this.svg.append('rect').classed('.graphBorder', true);
    }

    public get componentType() { return 'canvas'; }

    public createDefaults():CanvasDefaults {
        return {
            rx:     0,
            ry:     0,
            fill:   {
                color:   '#fff',
                opacity: 1            
            },
            stroke: {
                width: 1,
                color: '#00c',
                opacity: 1       
            }
        };
    }

    /**
     * renders the Graph's background canvas
     * @param cfg 
     */
    public renderComponent() {
        const canvas = this.cfg.defaults.canvas;
        d3Select('.graphArea')
            .attr('width', this.cfg.viewPort.width)
            .attr('height', this.cfg.viewPort.height)
            .attr('rx', canvas.rx)
            .attr('ry', canvas.ry)
            .attr('stroke-width', 0)
            .attr('fill', canvas.fill.color)
            .attr('fill-opacity', canvas.fill.opacity);
        d3Select('.graphBorder')
            .attr('width', this.cfg.viewPort.width)
            .attr('height', this.cfg.viewPort.height)
            .attr('rx', canvas.rx)
            .attr('ry', canvas.ry)
            .attr('stroke', canvas.stroke.color)
            .attr('stroke-width', canvas.stroke.width)
            .attr('stroke-opacity', canvas.stroke.opacity)
            .attr('fill-opacity', 0);
    }
}