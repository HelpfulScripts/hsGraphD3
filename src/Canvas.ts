

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
        return def.defaultRect('#fff', 1, '#00c');
    }

    initialize(svg:def.d3Base): void {
        this.svg.append('rect').classed('graphArea', true);
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
        def.setRect(area, <CanvasDefaults>canvas)
            .attr('width', this.cfg.viewPort.width)
            .attr('height', this.cfg.viewPort.height);
    }
}