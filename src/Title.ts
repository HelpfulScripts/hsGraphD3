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
 * const graph = new hsGraphD3.GraphCartesian(root);
 * graph.series.add('bubble', {x:'time', y:'volume', r:'costs'});
 * graph.title.text = 'My Bubble Chart';
 * graph.render(data);
 * 
 * </file>
 * </example>
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
import { d3Base, setText }               from './Settings';
import { defaultText }          from './Settings';
import { TextStyle }            from './Settings';
import { UnitPercent }          from './Settings';

export interface TitleDefaults extends ComponentDefaults { 
    rendered:   boolean;
    x:          UnitPercent;
    y:          UnitPercent;
    style:      TextStyle;
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
        return {
            rendered:   false,
            x:          '0%',
            y:          '0%',
            style:       defaultText(),
        };
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
            const svg = this.svg.select('text');
            setText(svg, titleDefs.style, this.cfg.transition);
            svg.attr('x',0).attr('y',0)
            .text(this.titleText);
        }
    }

    postRender(): void {} 
}