/**
 * # Title component
 * renders the `Graph's` Title.
 * 
 * ### Title Default Settings:
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
 *              .inspect(new hsGraphD3.GraphCartesian(svgRoot[0]).defaults.title, null, '   ', colors)
 *              .replace(/\n/g, '<br>')
 *      }
 *   } 
 * });
 * </file>
 * </example>
 */

 /** */
import { select as d3Select }   from 'd3'; 
import { ComponentDefaults }    from './GraphComponent'; 
import { GraphComponent }       from './GraphComponent'; 
import { GraphCfg }             from './GraphComponent'; 
import { d3Base }               from './Settings';
import { UnitPercent }          from './Settings';
import { setRect }              from './Settings';

export interface TitleDefaults extends ComponentDefaults { 
    x: UnitPercent;
    y: UnitPercent;
}


export class Title extends GraphComponent {
    static type = 'title';

    constructor(cfg:GraphCfg) {
        super(cfg, Title.type);
    }

    public get componentType() { return Title.type; }

    public get defaults():TitleDefaults { return <TitleDefaults>this.cfg.defaults[this.componentType]; }

    public createDefaults():TitleDefaults {
        return {
            x: '0%',
            y: '0%'
        };
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
        const title = this.cfg.defaults.title;
    }

    postRender(): void {} 
}