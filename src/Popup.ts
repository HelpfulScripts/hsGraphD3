/**
 * # Popup component
 * renders popups for mouseovers in the graph.
 * 
 * ### Example
 * <example height=200px libs={hsGraphD3:'hsGraphD3'}>
 * <file name='script.js'>
 * // create popup content:
 * const popup = (row) => `${row[0]}: ${row[3]}`;
 * const label = (row) => `Costs = ${row[3]}`;
 * 
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
 * graph.add('bubble', {x:'time', y:'costs', r:'volume', popup: popup, label: label});
 * with (graph.defaults.series[1].label) {
 *      xpos = 'right';
 *      inside = false;
 * }
 * graph.title.text = 'Popup examples';
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
 *              .inspect(new hsGraphD3.Graph(svgRoot[0]).defaults.popup, {})
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
import { d3Base, defaultArea }  from './Settings';
import { defaultTextStyle }     from './Settings';
import { TextStyle }            from './Settings';
import { Area }                 from './Settings';
import { AccessFn }             from './Graph';
import { select }               from 'd3';
 
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
        const style = this.cfg.baseSVG.append('style');
        style.text('.popup:hover { filter: brightness(0.8);}');
    }

    public get componentType() { return Popup.type; }

    public get defaults():PopupDefaults { return this.cfg.graph.defaults.popup; }
 
    public createDefaults():PopupDefaults {
        const defs:PopupDefaults = {
            rendered:   false,
            fill:       defaultArea('#eee', 0.8),
            style:      defaultTextStyle(10),
            offset:     { xPx:-50, yPx:-50 }

        };
        defs.style.font.weight = 'bold';    // 100-900
        return defs;
    }

    /**
     * adds listeners to the `items` to enable popup messages when moused-over.
     * @param items the items to add the listeners to
     * @param popupAccess an `AccessFn` that produces the content of the popup. The function
     * is passed the data row and row index in the data set for the item, as well as the horizontal range value 
     * for the mouse position. If `items` are a series `line` or `area`, the data and index values will be `undefined`.
     * Implementations should check for this case.
     */
    public addListener(items:d3Base, popupAccess:AccessFn) {
        items
            .classed(`popup`, true)
            .on('mouseenter', e=> this.showPopup(popupAccess).bind(this)(e.currentTarget.__data__, undefined, e.layerX))
            .on('mousemove',  e=> this.movePopup(popupAccess, e).bind(this)(e.currentTarget.__data__, undefined, e.layerX))
            .on('mouseleave', this.hidePopup.bind(this));
    }
    
    private showPopup(popupAccess:AccessFn) { 
        const p = this;
        const scale = this.cfg.components.scales.scaleDims.hor;
        return (d:number[], i:number, xpos:number) => p.svg
            .html(<string>popupAccess(d,i, scale?.invert? scale.invert(xpos) : xpos))
            .transition()		
            .duration(100)		
            .style('opacity', this.defaults.fill.opacity);		
    }

    private movePopup(popupAccess:AccessFn, event:any) {
        const o = this.defaults.offset;
        this.svg
            .style('left', `${event.pageX+o.xPx}px`)		
            .style('top',  `${(event.pageY+o.yPx)}px`);
        return this.showPopup(popupAccess);
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
            select(`#${parentID} .tooltip`).remove();
            this.svg = select(`#${parentID}`).append('div');
            this.svg.attr('id', 'tooltip').attr('style', `
                position: fixed;
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