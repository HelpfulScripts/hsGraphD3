

import { select as d3Select }   from 'd3'; 
import * as gc                  from './GraphComponent'; 
import * as def                 from './Settings';

export interface CanvasDefaults extends gc.ComponentDefaults, def.RectStyle { }


export class Canvas extends gc.GraphComponent {
    static type = 'canvas';

    constructor(cfg:gc.GraphCfg) {
        super(cfg, Canvas.type);
    }

    public get componentType() { return Canvas.type; }

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

    initialize(svg:def.d3Base): void {
        this.svg.append('rect').classed('graphArea', true);
        this.svg.append('rect').classed('graphBorder', true);
    } 

    preRender(): void {
    } 

    /**
     * renders the Graph's background canvas
     * @param cfg 
     */
    public renderComponent() {
        const canvas = this.cfg.defaults.canvas;
        const area = this.svg.select('.graphArea');
        area
            .attr('width', this.cfg.viewPort.width)
            .attr('height', this.cfg.viewPort.height)
            .attr('rx', canvas.rx)
            .attr('ry', canvas.ry)
            .attr('stroke-width', 0);
        def.setFill(area, canvas.fill);
        const border = this.svg.select('.graphBorder');
        border
            .attr('width', this.cfg.viewPort.width)
            .attr('height', this.cfg.viewPort.height)
            .attr('rx', canvas.rx)
            .attr('ry', canvas.ry)
            .attr('fill-opacity', 0);
        def.setStroke(border, canvas.stroke);
    }
}