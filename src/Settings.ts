/**
 * # Configuration Defaults 
 * 
 * provides `type` aliases, `interfaces`, and support functions to generate default settings for {@link GraphComponent GraphComponents}.
 * 
 * Each `graph` instance maintains its own copy of component settings. 
 * The setting are initialized during construction and can be modified as needed. 
 * `graph` provides two paths to access and modify setting:
 * - `graph.defaults.<component>.<subselector>` provides a central access to collection of 
 * all component settings via the `graph's` default getter. The table below lists all settings
 * available under `graph.defaults`.
 * - Each `GraphComponent` provides access to the component's default settings via `<component>.defaults.<subselector>`.
 * These are also accessible via the `graph's` `defaults` getter. 
 * 
 * For example, the `canvas` settings can be accessed via `graph.canvas.defaults` and 
 * `grpah.defaults.canvas`;
 * 
 * ### Accessible format setting and defaults (for a cartesian graph):
 * <example height=600px libs={hsGraphD3:'hsGraphD3', hsUtil:'hsUtil'}>
 * <file name='script.js'>
 * const log = new hsUtil.Log('');
 * let defaults;
 * 
 * function createGraph(svgRoot) {
 *      const graph = new hsGraphD3.GraphCartesian(svgRoot);
 *      graph.series.add('bubble', 'time', 'volume', 'costs');
 *      graph.canvas.defaults.stroke.width = 7.8; // odd number, should appear on the left
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
 *          defaults = log.inspect(createGraph(svgRoot[0]), null)
 *              .replace(/\n/g, '<br>')
 *      }
 *   } 
 * });
 * </file>
 * </example>
 */

/** */

import { Log }                  from 'hsutil'; const log = new Log('Defaults');
import { ComponentDefaults }    from './GraphComponent';
// import { Line }                 from './Settings';


/** viewport units */
export type UnitVp = number;        

/** CSS px units */
export type UnitPx = number;        

/** percent units */
export type UnitPercent = string;        

/** CSS general units */
export type Unit = string|UnitPx;   // general CSS unit type

export interface RectDef { x:UnitVp; y:UnitVp; width:UnitVp; height:UnitVp; }

export type d3Base = d3.Selection<d3.BaseType, unknown, d3.BaseType, any>; 

export type DefaultsAccess  = (compName:string) => ComponentDefaults;
export type Color           = string;           // CSS color descriptor, e.g. '#fff'
export type ZeroToOne       = number;           // number from [0, 1]
export type Index           = number;           // column index into data table


//---------- interfaces --------------

export interface Rendered {
    rendered: boolean;
}
export interface Line extends Stroke, Rendered {}
export interface Area extends Fill, Rendered { border: Stroke; }
export interface Marker extends MarkerStyle, Rendered {}
export interface Text extends TextStyle, Rendered {}
export interface Popup extends Text {}

export interface Fill {
    color: Color;
    opacity: ZeroToOne;
}

export interface Stroke {
    width: UnitVp;
    color: Color;
    opacity: ZeroToOne;
    dashed: string;
}

export interface Font {
    family: string;     // e.g. 'sans-serif';
    size: UnitVp;       // e,g, 12
    style: string;      // 'normal', 'italic'
    weight: string;     // 'normal', 'bold'
}

export interface RectStyle {
    rx:     UnitVp;
    ry:     UnitVp;
    fill:   Fill;
    stroke: Stroke;
}

export interface TextStyle {
    color:  Color;
    font:   Font;
}


export enum TextHAlign {
    start   = 'start',
    middle  = 'middle',
    end     = 'end'
}


export enum TextVAlign {
    top     = 'top',
    center  = 'center',
    bottom  = 'bottom'
}


export interface Label extends TextStyle, Rendered {
    xpos: TextHAlign;
    ypos: TextVAlign;
    hOffset: number;    // offset in `em`
    vOffset: number;    // offset in `em`
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
        dashed: ''      // or '5,10,5', alternating filled and blank
    };
};

export const defaultLine = (width:UnitVp, color:Color='currentColor'):Line => {
    const def:any = defaultStroke(width, color);
    def.rendered = true;
    return def;
};

export const defaultArea = (areaFill:Color = 'currentColor', opacity=0.5):Area => {
    return {
        rendered: false,
        color: areaFill,
        opacity: opacity,
        border: defaultStroke(0, '#fff')
    };
};

export const defaultFont = (size=16):Font => {
    return {
        family: 'sans-serif',
        size:   size,
        style: 'normal',    // 'normal', 'italic'
        weight: '100'       // 'normal', 'bold', 100 - 999
    };
};

export const defaultLabel = (areaFill:Color = 'currentColor', opacity=0.5):Label => {
    return {
        color: areaFill,
        font:   defaultFont(),
        xpos: TextHAlign.middle,
        ypos: TextVAlign.center,
        hOffset: 0,    // offset in `em`
        vOffset: 0,    // offset in `em`
        rendered: false
        };
};


/**
 * convenience function to create a default `RectStyle` object with configurable fill color and border. 
 * @param area  the fill color
 * @param borderWidth the border width in pixel
 * @param borderColor the border color
 */
export const defaultRectStyle = (areaFill:Color, borderWidth:UnitVp=0, borderColor:Color='currentColor'):RectStyle => {
    return {
        rx: 0,
        ry: 0,
        fill:   defaultArea(areaFill, 1),
        stroke: defaultStroke(borderWidth, borderColor)
    };
};

export const defaultText = (size=16):Text => {
    const ts = <Text>defaultTextStyle(size);
    ts.rendered = true;
    return ts;
};

export const defaultTextStyle = (size=16):TextStyle => {
    return {
        color:  'currentColor',
        font:   defaultFont(size)
    };
};

export const defaultMarkerStyle = (color='currentColor', shape=MarkerShape.circle, size=10):MarkerStyle => {
    return {
        size:   size,
        shape:  shape,
        fill:   defaultArea(color, 0.75),
        stroke: defaultStroke(4)
    };
};


//---------- drawing --------------

export function setStroke(svg:d3Base, settings:Stroke):d3Base {
    return svg 
    .attr('stroke',         settings.color)
    .attr('stroke-width',   settings.width)
    .attr('stroke-opacity', settings.opacity)
    .attr('stroke-dasharray', settings.dashed)
    .attr('fill-opacity',   0);
}

export function setFill(svg:d3Base, settings:Fill):d3Base {
    return svg 
    .attr('fill',         settings.color)
    .attr('fill-opacity', settings.opacity);
}

export function setArea(svg:d3Base, settings:Area):d3Base {
    return setStroke(svg, settings.border)
    .attr('fill',         settings.color)
    .attr('fill-opacity', settings.opacity);
}

export function setLabel(svg:d3Base, settings:Label):d3Base {
    return svg 
    .attr('fill',        settings.color)
    .attr('font-family', settings.font.family)
    .attr('font-size',   settings.font.size+'px')
    .attr('font-style',  settings.font.style)
    .attr('font-weight', settings.font.weight);
}

export function setPopup(svg:d3Base, settings:Popup):d3Base {
    return svg
    .attr('fill',        settings.color)
    .attr('font-family', settings.font.family)
    .attr('font-size',   settings.font.size+'px')
    .attr('font-style',  settings.font.style)
    .attr('font-weight', settings.font.weight);
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
        .attr('fill', settings.color)
        .attr('font-family', settings.font.family)
        .attr('font-size',   settings.font.size+'px')
        .attr('font-style',  settings.font.style)
        .attr('font-weight', settings.font.weight);
}

