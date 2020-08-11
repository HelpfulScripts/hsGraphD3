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
 *      const graph = new hsGraphD3.Graph(svgRoot);
 *      graph.add('column', 'time', 'volume', 'costs');
 *      graph.canvas.defaults.stroke.width = 7.8; // odd number, should appear on the left
 *      return graph.defaults;
 * }
 * 
 * m.mount(root, {
 *   view:() => m('div', {style:'background-color:#eee; font-family:Monospace; font-size:14px'}, [
 *      m('div', m.trust('graph.defaults = ' + defaults)), 
 *      m('div.myGraph', '')
 *   ]),
 *   oncreate: () => {
 *      const svgRoot = root.getElementsByClassName('myGraph');
 *      if (svgRoot && svgRoot.length && !defaults) { 
 *          const colors = ['#800', '#080', '#008'];
 *          defaults = log.inspect(createGraph(svgRoot[0]), {})
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
import { interpolateBlues }     from 'd3';
import { interpolateGreens }    from 'd3';
import { interpolateGreys }     from 'd3';
import { interpolateOranges }   from 'd3';
import { interpolatePurples }   from 'd3';
import { interpolateReds }      from 'd3';
import { schemeCategory10 }     from 'd3';


// interface Scheme { (fraction:number):string; }


export const schemes = {
    'cat10':   (fraction:number) => schemeCategory10[fraction>1? (fraction % 10) : Math.round((fraction*10)).toFixed(0)],
    'blues':   (fraction:number) => interpolateBlues(fraction),
    'greens':  (fraction:number) => interpolateGreens(fraction),
    'greys':   (fraction:number) => interpolateGreys(fraction),
    'oranges': (fraction:number) => interpolateOranges(fraction),
    'purples': (fraction:number) => interpolatePurples(fraction),
    'reds':    (fraction:number) => interpolateReds(fraction),
};


/** viewport units */
export type UnitVp = number;        

/** CSS `px` units */
export type UnitPx = number;        

/** CSS `em` units */
export type UnitEm = number;        

/** percent units */
export type UnitPercent = string;        

/** CSS general units */
export type Unit = string|UnitPx|UnitEm;   // general CSS unit type

export interface RectDef { x:UnitVp; y:UnitVp; width:UnitVp; height:UnitVp; }

export type d3Base = d3.Selection<d3.BaseType, unknown, d3.BaseType, any>; 

export type DefaultsAccess  = (compName:string) => ComponentDefaults;
/** CSS color descriptor, e.g. '#fff' */
export type Color           = string;
/** column index into data table */
export type Index           = number;
/** angle in `radians` */
export type Radians         = number; 
/** number in the range [0, 1] indicating a share or ratio; */ 
export type Share           = number;


//---------- interfaces --------------

export interface Rendered {
    rendered: boolean;
}
export interface Line extends Stroke, Rendered { smoothing: number; }
export interface Area extends Fill, Rendered { border: Stroke; }
export interface Marker extends MarkerStyle, Rendered {}
export interface Text extends TextStyle, Rendered {}
export interface Popup extends Text {}

export interface Fill {
    color: Color;
    opacity: Share;
}

export interface Stroke {
    width: UnitVp;
    color: Color;
    opacity: Share;
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


/** horizontal text alignment  */
export enum TextHAlign {
    left    = 'left',
    center  = 'center',
    right   = 'right'
}

/** vertical text alignment  */
export enum TextVAlign {
    top     = 'top',
    center  = 'center',
    bottom  = 'bottom'
}

/** horizontal positioning  */
export enum HPos {
    left    = 'left',
    center  = 'center',
    right   = 'right'
}

/** vertical positioning  */
export enum VPos {
    top     = 'top',
    center  = 'center',
    bottom  = 'bottom'
}

/** defines `Label` configurations: */
export interface Label extends TextStyle, Rendered {
    /**
     * indicates the horizontal alignemnt of the label. 
     * Either a {@link Settings.HPos HPos} or a number or percentage indicating 
     * the horizontal position with `0=0%=left` and `1=100%=right`. 
     * Defaults to `HPos.center`.
     */
    xpos: HPos | Share | UnitPercent;
    /**
     * indicates the vertical alignemnt of the label. 
     * Either a {@link Settings.VPos VPos} or a number or percentage indicating 
     * the vertical position with `0=0%=top` and `1=100%=bottom`. 
     * Defaults to `VPos.center`.
     */
    ypos: VPos | Share | UnitPercent;
    /**
     * offsets the label horizontally be the specified `em` value.
     * positive numbers shift right. Defaults to 0.
     */
    hOffset: UnitEm;    // offset in `em`
    /**
     * offsets the label vertically be the specified `em` value
     * positive numbers shift down. Defaults to 0.
     */
    vOffset: UnitEm;    // offset in `em`
    /**
     * if `true`, renders labels inside the marker. 
     * If `false`, renders labels outside the marker when `xpos` or `ypos`
     * are not `center`. Defaults to `true`.
     */
    inside: boolean;    // render label inside the area
}

export enum MarkerShape {
    square, diamond, tri_up, tri_down, circle
}

export interface MarkerStyle {
    size:   UnitVp;
    shape:  MarkerShape;
    fill:   Fill;
    stroke: Stroke;
    scheme: string;
}

function pct2Share(v:UnitPercent | Share | HPos | VPos):Share {
    if (!isNaN(<Share>v)) { 
        return <number>v; 
    } else if ((<UnitPercent>v).endsWith('%')) {
        return parseInt(<UnitPercent>v)/100;
    } else {
        switch(v) {
            case TextHAlign.left:
            case TextVAlign.top:    return 0;
            case TextHAlign.right:
            case TextVAlign.bottom: return 1;
            case TextHAlign.center:
            case TextVAlign.center: return 0.5;
            default: log.warn(`value ${v} is neither numeric, an alignment, nor a percentage`);
                return 0;
        }
    }
}

export interface TextPos {
    x:{pos: number, shift:number, anchor:string};
    y:{pos: number, shift:number, baseline:string};
}

export function textPos(x:UnitPercent|Share|HPos, y:UnitPercent|Share|VPos, inside=true):TextPos {
    let xpos = pct2Share(x);
    let ypos = pct2Share(y);
    const anchor   = (xpos<0.33)? (inside?'start':'end')        : ((xpos>0.66)? (inside?'end':'start') : 'middle');
    const baseline = (ypos<0.33)? (inside?'hanging':'baseline') : ((ypos>0.66)? (inside?'baseline':'hanging') : 'middle');
    let xShift     = (xpos<0.33)? (inside?1:-1) : ((xpos>0.66)? (inside?-1:1) : 0);
    let yShift     = (ypos<0.33)? (inside?1:-1) : ((ypos>0.66)? (inside?-1:1) : 0);
    return {x:{pos:xpos, shift:xShift, anchor:anchor}, y:{pos:ypos, shift:yShift, baseline:baseline}};
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
    def.smoothing = 0.5;
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
        color:  areaFill,
        font:   defaultFont(),
        xpos:   HPos.center,
        ypos:   VPos.center,
        hOffset: 0,     // offset in `em`
        vOffset: 0,     // offset in `em`
        inside: true,   // inside the area
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

export const defaultMarker = (color='currentColor', shape=MarkerShape.circle, size=10):Marker => {
    const def:any = defaultMarkerStyle(color, shape, size);
    def.rendered = true;
    return def;
};

export const defaultMarkerStyle = (color='currentColor', shape=MarkerShape.circle, size=10):MarkerStyle => {
    return {
        size:   size,
        shape:  shape,
        fill:   defaultArea(color, 0.75),
        stroke: defaultStroke(4),
        scheme: 'cat10'
    };
};


//---------- drawing --------------

export function setStroke(svg:d3Base, settings:Stroke):d3Base {
    return (!settings || !settings.width)? svg : svg 
    .attr('stroke',         settings.color)
    .attr('stroke-width',   settings.width)
    .attr('stroke-opacity', settings.opacity)
    .attr('stroke-dasharray', settings.dashed||'none')
    .attr('fill-opacity',   0);
}

export function setFill(svg:d3Base, settings:Fill):d3Base {
    return !settings? svg : svg 
    .attr('fill',         settings.color)
    .attr('fill-opacity', settings.opacity);
}

export function setArea(svg:d3Base, settings:Area):d3Base {
    return setStroke(svg, settings.border)
    .attr('fill',         settings.color)
    .attr('fill-opacity', settings.opacity);
}

export function setLabel(svg:d3Base, settings:Label):d3Base {
    return !settings? svg : svg 
    .attr('fill',        settings.color)
    .attr('font-family', settings.font.family)
    .attr('font-size',   settings.font.size+'px')
    .attr('font-style',  settings.font.style)
    .attr('font-weight', settings.font.weight);
}

export function setPopup(svg:d3Base, settings:Popup):d3Base {
    return !settings? svg : svg 
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

