/**
 * # Canvas component
 * renders the `Graph's` background, covering the entire viewport.
 * 
 * ### Canvas Default Settings:
 * <example height=300px libs={hsGraphD3:'hsGraphD3', hsUtil:'hsUtil'}>
 * <file name='script.js'>
 * const log = hsUtil.log('');
 * let defaults;
 * 
 * m.mount(root, {
 *   view:() => m('div', {style:'background-color:#eee; font-family:Monospace'}, [
 *      m('div', m.trust('graph.canvas.defaults = ' + defaults)), 
 *      m('div.myGraph', '')
 *   ]),
 *   oncreate: () => {
 *      const svgRoot = root.getElementsByClassName('myGraph');
 *      if (svgRoot && svgRoot.length && !defaults) { 
 *          const colors = ['#800', '#080', '#008'];
 *          defaults = hsUtil.log
 *              .inspect(new hsGraphD3.GraphCartesian(svgRoot[0]).defaults.canvas, null, '   ', colors)
 *              .replace(/\n/g, '<br>')
 *      }
 *   } 
 * });
 * </file>
 * </example>
 */

 /** */
import { GraphComponent }       from './GraphComponent'; 
import { ComponentDefaults }    from './GraphComponent'; 
import { GraphCfg }             from './GraphComponent'; 
import { RectStyle }            from './Settings';
import { defaultRectStyle }     from './Settings';
import { d3Base }               from './Settings';
import { setRect }              from './Settings';

export interface CanvasDefaults extends ComponentDefaults, RectStyle { }


export class Canvas extends GraphComponent {
    static type = 'canvas';

    constructor(cfg:GraphCfg) {
        super(cfg, Canvas.type);
    }

    public get componentType() { return Canvas.type; }

    public get defaults():CanvasDefaults { return this.cfg.graph.defaults.canvas; }

    public createDefaults():CanvasDefaults {
        return defaultRectStyle('#fff', 1, '#00c');
    }

    initialize(svg:d3Base): void {
        this.svg.append('rect').classed('graphArea', true);
    } 

    preRender(): void {} 

    /**
     * renders the Graph's background canvas
     * @param cfg 
     */
    public renderComponent() {
        const canvas = this.defaults;
        const area = this.svg.select('.graphArea');
        setRect(area, canvas)
            .attr('width', this.cfg.viewPort.width)
            .attr('height', this.cfg.viewPort.height);
    }

    postRender(): void {} 
}