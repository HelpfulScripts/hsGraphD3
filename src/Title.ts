/**
 * # Title component
 * renders the `Graph's` Title.
 * 
 * ### Example
 * <example height=200px libs={hsGraphD3:'hsGraphD3'}>
 * <file name='script.js'>
 * // create data set:
 * const data = {
 *    colNames: ['date', 'time', 'volume', 'costs'], 
 *    rows:[    ['1/1/14', -1,     0.2,      0.3], 
 *              ['1/1/16', 0.2,    0.7,      0.2], 
 *              ['9/1/16', 0.4,    0.1,      0.3],
 *              ['5/1/17', 0.6,   -0.2,      0.1], 
 *              ['7/1/18', 0.8,    0.3,      0.5], 
 *              ['1/1/19', 1,      0.2,      0.4]]
 * };
 * 
 * // setup and plot the data:
 * const graph = new hsGraphD3.Graph(root);
 * graph.add('bubble', {x:'time', y:'volume', r:'costs'});
 * graph.title.text = 'My Bubble Chart';
 * graph.render(data);
 * 
 * </file>
 * </example>
 * 
 * ### Title Default Settings:
 * <example height=300px libs={hsGraphD3:'hsGraphD3', hsUtil:'hsUtil'}>
 * <file name='script.js'>
 * const log = new hsUtil.Log('');
 * let defaults;
 * 
 * m.mount(root, {
 *   view:() => m('div', {style:'background-color:#eee; font-family:Monospace'}, [
 *      m('div', m.trust('graph.title.defaults = ' + defaults)), 
 *      m('div.myGraph', '')
 *   ]),
 *   oncreate: () => {
 *      const svgRoot = root.getElementsByClassName('myGraph');
 *      if (svgRoot && svgRoot.length && !defaults) { 
 *          const colors = ['#800', '#080', '#008'];
 *          defaults = log
 *              .inspect(new hsGraphD3.Graph(svgRoot[0]).defaults.title, null, '   ', colors)
 *              .replace(/\n/g, '<br>')
 *      }
 *   } 
 * });
 * </file>
 * </example>
 */

 /** */
import { Log }                  from 'hsutil'; const log = new Log('Title');
import { ComponentDefaults }    from './GraphComponent'; 
import { GraphComponent }       from './GraphComponent'; 
import { GraphCfg }             from './GraphComponent'; 
import { d3Base, textPos, VPos, HPos }      from './Settings';
import { Share }                from './Settings';
import { setText }              from './Settings';
import { defaultTextStyle }     from './Settings';
import { TextStyle }            from './Settings';
import { UnitPercent }          from './Settings';

export interface TitleDefaults extends ComponentDefaults { 
    rendered:   boolean;
    /** 
     * the horizontal position of the title on the viewport, either as a number between [0, 1]
     * or a percentage, or a `HPos` value: `0=0%=left edge`, `1=100%right` edge of the viewport.
     */
    x: UnitPercent | Share | HPos;
    /** 
     * the vertical position of the title on the viewport, either as a number between [0, 1]
     * or a percentage, or a `VPos` value: `0=0%=top` edge, `1=100%=bottom` edge of the viewport.
     */
    y: UnitPercent | Share | VPos;
    style: TextStyle;
}


export class Title extends GraphComponent {
    static type = 'title';

    titleText = '';

    constructor(cfg:GraphCfg) {
        super(cfg, Title.type);
    }

    public get componentType() { return Title.type; }

    public get defaults():TitleDefaults { return this.cfg.graph.defaults.title; }

    public set text(title:string) { 
        this.titleText = title; 
        this.defaults.rendered = true;
    }

    public createDefaults():TitleDefaults {
        const defs = {
            rendered:   false,
            x:          0.05,
            y:          '5%',
            style:       defaultTextStyle(24),
        };
        defs.style.font.weight = 'bold';    // 100-900
        return defs;
    }

    initialize(svg:d3Base): void {
        this.svg.append('text');
    } 

    preRender(): void {} 

    /**
     * renders the Graph's background canvas
     * @param cfg 
     */
    public renderComponent() {
        const titleDefs = this.defaults;
        if (titleDefs.rendered) {
            const vp = this.cfg.viewPort;
            const pos = textPos(titleDefs.x, titleDefs.y);
            const svg = this.svg.select('text');
            setText(svg, titleDefs.style, this.cfg.transition);
            svg.attr('x', pos.x.pos * vp.width + vp.orgX).attr('text-anchor', pos.x.anchor)
               .attr('y', pos.y.pos * vp.height + vp.orgY).attr('dominant-baseline', pos.y.baseline)
               .text(this.titleText);
        }
    }

    postRender(): void {} 
}