/**
 * # Defaults Configuration
 * 
 * provides `type` aliases, `interfaces`, and support functions to generate default settings for {@link GraphComponent GraphComponents}.
 * 
 * ### Accessible format setting and defaults (for a cartesian graph):
 * <example height=600px libs={hsGraphD3:'hsGraphD3', hsUtil:'hsUtil'}>
 * <file name='script.js'>
 * const log = hsUtil.log('');
 * let defaults;
 * 
 * function createGraph(svgRoot) {
 *      const graph = new hsGraphD3.GraphCartesian(svgRoot);
 *      graph.addSeries('bubble', 'time', 'volume', 'costs');
 *      graph.defaults.canvas.stroke.width = 7.8; // odd number, should appear on the left
 *      return graph.defaults;
 * }
 * 
 * m.mount(root, {
 *   view:() => m('div', {style:'background-color:#eee; font-family:Monospace'}, [
 *      m('div', m.trust('graph.defaults = ' + defaults)), 
 *      m('div.myGraph', '')
 *   ]),
 *   oncreate: () => {
 *      const svgRoot = root.getElementsByClassName('myGraph');
 *      if (svgRoot && svgRoot.length && !defaults) { 
 *          const colors = ['#800', '#080', '#008'];
 *          defaults = hsUtil.log.inspect(createGraph(svgRoot[0]), null, '   ', colors)
 *              .replace(/\n/g, '<br>')
 *      }
 *   } 
 * });
 * </file>
 * </example>
 */

/** */

import { transition }   from 'd3';
import * as d       from './Settings';
import * as gc      from './GraphComponent';
import { log as _log }  from 'hsutil';import { setMaxListeners } from 'cluster';
const log = _log('Defaults');


export const d3Transition = transition().duration(1000);

/** viewport units */
export type UnitVp = number;        

/** CSS px units */
export type UnitPx = number;        

/** CSS general units */
export type Unit = string|UnitPx;   // general CSS unit type

export interface RectDef { x:UnitVp; y:UnitVp; width:UnitVp; height:UnitVp; }

export type d3Base = d3.Selection<d3.BaseType, unknown, d3.BaseType, any>; 

export type DefaultsType = {[compName:string]: gc.ComponentDefaults};

export type DefaultsAccess  = (compName:string) => gc.ComponentDefaults;
export type Color           = string;           // CSS color descriptor, e.g. '#fff'
export type ZeroToOne       = number;           // number from [0, 1]
export type Index           = number;           // column index into data table

export interface Area {
    color: Color;
    opacity: ZeroToOne;
}

export interface Line {
    width: UnitVp;
    color: Color;
    opacity: ZeroToOne;
}

export interface RectStyle {
    rx:     UnitVp;
    ry:     UnitVp;
    fill:   Area;
    stroke: Line;
}

export interface TextStyle {
    color: Color;
    font: {
        family: string;     // e.g. 'sans-serif';
        size: UnitVp;       // e,g, 12
        style: string;      // 'normal', 'italic'
        weight: string;     // 'normal', 'bold'
    };
}

export const defaultLine = (width:UnitVp, color:d.Color='currentColor'):d.Line => {
    return {
        width: width,
        color: color,
        opacity: 1
    };
};

export function setStroke(svg:d3Base, settings:d.Line) {
    svg 
    .attr('stroke',         settings.color)
    .attr('stroke-width',   settings.width)
    .attr('stroke-opacity', settings.opacity);
}

export const defaultFill = (areaFill:d.Color = '#fff') => {
    return {
        color: areaFill,
        opacity: 1
    };
};

export function setFill(svg:d3Base, settings:d.Area) {
    svg 
    .attr('fill',         settings.color)
    .attr('fill-opacity', settings.opacity);
}

/**
 * convenience function to create a default `RectStyle` object with configurable fill color and border. 
 * @param area  the fill color
 * @param borderWidth the border width in pixel
 * @param borderColor the border color
 */
export const defaultRect = (areaFill:d.Color, borderWidth:UnitVp=0, borderColor:d.Color='currentColor'):d.RectStyle => {
    return {
        rx: 0,
        ry: 0,
        fill:   defaultFill(areaFill),
        stroke: defaultLine(borderWidth, borderColor)
    };
};

export function setRect(svg:d3Base, settings:d.RectStyle) {
    svg .attr('rx', settings.rx)
        .attr('ry', settings.ry);
    setStroke(svg, settings.stroke);
    setFill(svg, settings.fill); 
}

export const defaultText = (size=16):d.TextStyle => {
    return {
        color: 'currentColor',
        font: {
            family: 'sans-serif',
            size:   size,
            style: 'normal',    // 'normal', 'italic'
            weight: '100'       // 'normal', 'bold', 100 - 999
        }
    };
};

export function setText(svg:d3Base, settings:d.TextStyle) {
    svg.transition(d3Transition)
        .attr('color', settings.color)
        .attr('font-family', settings.font.family)
        .attr('font-size',   settings.font.size+'px')
        .attr('font-style',  settings.font.style)
        .attr('font-weight', settings.font.weight);
}
