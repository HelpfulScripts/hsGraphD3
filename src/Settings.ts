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
 *   view:() => m('div', {style:'background-color:#eee; font-family:Monospace; font-size:12px'}, [
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

import { log as _log }          from 'hsutil'; const log = _log('Defaults');
import { ComponentDefaults }    from './GraphComponent';
import { Line }                 from './GraphComponent';


/** viewport units */
export type UnitVp = number;        

/** CSS px units */
export type UnitPx = number;        

/** CSS general units */
export type Unit = string|UnitPx;   // general CSS unit type

export interface RectDef { x:UnitVp; y:UnitVp; width:UnitVp; height:UnitVp; }

export type d3Base = d3.Selection<d3.BaseType, unknown, d3.BaseType, any>; 

export type DefaultsType = {[compName:string]: ComponentDefaults};

export type DefaultsAccess  = (compName:string) => ComponentDefaults;
export type Color           = string;           // CSS color descriptor, e.g. '#fff'
export type ZeroToOne       = number;           // number from [0, 1]
export type Index           = number;           // column index into data table


//---------- interfaces --------------

export interface Fill {
    color: Color;
    opacity: ZeroToOne;
}

export interface Stroke {
    width: UnitVp;
    color: Color;
    opacity: ZeroToOne;
    dashed: number[];
}

export interface RectStyle {
    rx:     UnitVp;
    ry:     UnitVp;
    fill:   Fill;
    stroke: Stroke;
}

export interface TextStyle {
    rendered: boolean;
    stroke: Stroke;
    font: {
        family: string;     // e.g. 'sans-serif';
        size: UnitVp;       // e,g, 12
        style: string;      // 'normal', 'italic'
        weight: string;     // 'normal', 'bold'
    };
}

export enum MarkerShape {
    square, diamond, tri_up, tri_down, circle
}

export interface MarkerStyle {
    size:   UnitVp;
    shape:  MarkerShape;
    fill:   Fill;
    stroke: Stroke;
}



//---------- defaults --------------

export const defaultStroke = (width:UnitVp, color:Color='currentColor'):Stroke => {
    return {
        width: width,
        color: color,
        opacity: 1,
        dashed: undefined   // or '5,10,5', alternating filled and blank
    };
};

export const defaultLine = (width:UnitVp, color:Color='currentColor'):Line => {
    const def:any = defaultStroke(width, color);
    def.rendered = true;
    return def;
};

export const defaultFill = (areaFill:Color = '#fff') => {
    return {
        color: areaFill,
        opacity: 1
    };
};

/**
 * convenience function to create a default `RectStyle` object with configurable fill color and border. 
 * @param area  the fill color
 * @param borderWidth the border width in pixel
 * @param borderColor the border color
 */
export const defaultRect = (areaFill:Color, borderWidth:UnitVp=0, borderColor:Color='currentColor'):RectStyle => {
    return {
        rx: 0,
        ry: 0,
        fill:   defaultFill(areaFill),
        stroke: defaultStroke(borderWidth, borderColor)
    };
};

export const defaultText = (size=16):TextStyle => {
    return {
        rendered: true,
        stroke: defaultStroke(1),
        font: {
            family: 'sans-serif',
            size:   size,
            style: 'normal',    // 'normal', 'italic'
            weight: '100'       // 'normal', 'bold', 100 - 999
        }
    };
};

export const defaultMarker = (shape=MarkerShape.circle, size=10):MarkerStyle => {
    return {
        size:   size,
        shape:  shape,
        fill:   {
            color: '#F00',
            opacity: 1             
        },
        stroke: defaultStroke(4)
    };
};

//---------- drawing --------------

export function setStroke(svg:d3Base, settings:Stroke):d3Base {
    return svg 
    .attr('stroke',         settings.color)
    .attr('stroke-width',   settings.width)
    .attr('stroke-opacity', settings.opacity)
    .attr('fill-opacity',   0);
}

export function setFill(svg:d3Base, settings:Fill):d3Base {
    return svg 
    .attr('fill',         settings.color)
    .attr('fill-opacity', settings.opacity);
}

export function setRect(svg:d3Base, settings:RectStyle):d3Base {
    svg .attr('rx', settings.rx)
        .attr('ry', settings.ry);
    setStroke(svg, settings.stroke);
    setFill(svg, settings.fill); 
    return svg;
}

export function setText(svg:d3Base, settings:TextStyle, transition:any) {
    svg.transition(transition)
        .attr('color', settings.stroke.color)
        .attr('font-family', settings.font.family)
        .attr('font-size',   settings.font.size+'px')
        .attr('font-style',  settings.font.style)
        .attr('font-weight', settings.font.weight);
}

