/**
 * # Popup component
 * renders popups for mouseovers in the graph.
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
 * ### Popup Default Settings:
 * <example height=300px libs={hsGraphD3:'hsGraphD3', hsUtil:'hsUtil'}>
 * <file name='script.js'>
 * const log = new hsUtil.Log('');
 * let defaults;
 * 
 * m.mount(root, {
 *   view:() => m('div', {style:'background-color:#eee; font-family:Monospace'}, [
 *      m('div', m.trust('graph.popup.defaults = ' + defaults)), 
 *      m('div.myGraph', '')
 *   ]),
 *   oncreate: () => {
 *      const svgRoot = root.getElementsByClassName('myGraph');
 *      if (svgRoot && svgRoot.length && !defaults) { 
 *          const colors = ['#800', '#080', '#008'];
 *          defaults = log
 *              .inspect(new hsGraphD3.GraphCartesian(svgRoot[0]).defaults.popup, null, '   ', colors)
 *              .replace(/\n/g, '<br>')
 *      }
 *   } 
 * });
 * </file>
 * </example>
 */

/** */
import { Log }                  from 'hsutil'; const log = new Log('Popup');
import { ComponentDefaults }    from './GraphComponent'; 
import { GraphComponent }       from './GraphComponent'; 
import { GraphCfg }             from './GraphComponent'; 
import { d3Base, defaultArea }               from './Settings';
import { defaultTextStyle }     from './Settings';
import { TextStyle }            from './Settings';
import { Area }                 from './Settings';
import { AccessFn }             from './Graph';
import { select, event }        from 'd3';
 
export interface PopupDefaults extends ComponentDefaults { 
    rendered:   boolean;
    style:      TextStyle;
    fill:       Area;
    offset: { xPx: number, yPx:number; };
}

let cnt=0;

export class Popup extends GraphComponent {
    static type = 'popup';

    constructor(cfg:GraphCfg) {
        super(cfg, Popup.type);
    }

    public get componentType() { return Popup.type; }

    public get defaults():PopupDefaults { return this.cfg.graph.defaults.popup; }
 
    public createDefaults():PopupDefaults {
        const defs:PopupDefaults = {
            rendered:   false,
            fill:       defaultArea('#eee', 0.8),
            style:      defaultTextStyle(10),
            offset:     { xPx: -50, yPx:5 }

        };
        defs.style.font.weight = 'bold';    // 100-900
        return defs;
    }

    public addListener(items:d3Base, popupAccess:AccessFn) {
        items
            .on('mouseenter', this.showPopup(popupAccess).bind(this))
            .on('mousemove', this.movePopup.bind(this))
            .on('mouseleave', this.hidePopup.bind(this));
    }
    
    private showPopup(popupAccess:AccessFn) { 
        return (d:number[], i:number) => {	
        this.svg
            .html(<string>popupAccess(d,i))	
            .transition()		
            .duration(100)		
            .style('opacity', this.defaults.fill.opacity)	
            ;		
        };
    }

    private movePopup() {
        const o = this.defaults.offset;
        this.svg
            .style('left', `${event.layerX+o.xPx}px`)		
            .style('top',  `${(event.layerY+o.yPx)}px`);
    }					

    private hidePopup() {
        this.svg
        .transition()		
        .duration(500)		
        .style('opacity', 0);	
    }

    public initialize(svg:d3Base): void {
        const def = this.defaults;
        const parentID = (<any>this.cfg.baseSVG)._groups[0][0].parentElement.id;
        if (parentID) {
            this.svg = select(`#${parentID}`).append('div');
            this.svg.attr('id', 'tooltip').attr('style', `
                position: absolute;
                padding: 5px;
                background-color: ${def.fill.color};
                border: ${def.fill.border.width}px solid ${def.fill.border.color};
                border-radius: 5px;
                color: ${def.style.color};
                font-family: ${def.style.font.family};
                font-size: ${def.style.font.size};
                font-style: ${def.style.font.style};
                font-weight: ${def.style.font.weight};
                text-align: center;
                line-height: 1.2em;
            `)
            .style('opacity', 0);
        } else {
            this.svg = undefined;
        }
    } 
 
    preRender(): void {} 

    public renderComponent() {
    }

    postRender(): void {} 
}