/**
 * # Defaults Configuration
 * 
 */

/** */

import { GraphDefaults }    from './DefaultTypes';
import { PlotDefaults }     from './DefaultTypes';
import { SeriesDefaults }   from './DefaultTypes';
import { AxesDefaults }     from './DefaultTypes';
import { Color }            from './DefaultTypes';
import { RectStyle }        from './DefaultTypes';
import { Line }             from './DefaultTypes';
import { UnitVp }           from './ConfigTypes';
import { ScaleDefaults }    from './DefaultTypes';
import { TextStyle }        from './DefaultTypes';
import { GraphCfg }         from './ConfigTypes';


/**
 * Create a `Config` object and populate it with default values.
 */
export class Defaults {
    // private axes = {};
    // private config: GraphCfg;
    // private theScales = {};

    constructor(config: GraphCfg) { }

    graph:GraphDefaults = {
        canvas: defaultRect('#fff', 2, '#ccc')
    };

    plot:PlotDefaults = {
        area: defaultRect('#fff'),
        margin: { left:10, top:10, right:10, bottom:10}
    };

    series:SeriesDefaults[] = [];

    axes:AxesDefaults = { 
        hor: {
            line:       defaultLine(2),
            tickMarks:  defaultLine(2),
            tickLabel:  defaultText()
        },
        ver: {
            line:       defaultLine(2),
            tickMarks:  defaultLine(2),
            tickLabel:  defaultText()
        }
    };

    scales:{[column:string]: ScaleDefaults} = {};

    defaultScale():ScaleDefaults { 
        return {
            type:   'linear',
            domain: {min: 'auto', max: 'auto'}, //  data domain
            range:  { min: 0, max: 1 }          //  canvas range
        };
    }
}

export function defaultLine(width:UnitVp, color:Color='#000'):Line {
    return {
        width: width,
        color: color,
        opacity: 1
    };
}

/**
 * convenience function to create a default `RectStyle` object with configurable fill color and border. 
 * @param area  the fill color
 * @param borderWidth the border width in pixel
 * @param borderColor the border color
 */
function defaultRect(area:Color, borderWidth:UnitVp=0, borderColor:Color='#fff'):RectStyle {
    return {
        rx: 0,
        ry: 0,
        fill: {
            color: area,
            opacity: 1
        },
        stroke: {
            width: borderWidth,
            color: borderColor,
            opacity: 1
        }
    };
}

function defaultText():TextStyle {
    return {
        color: '#000',
        font: {
            family: 'sans-serif',
            size:   20,
            style: 'normal',    // 'normal', 'italic'
            weight: 'normal'    // 'normal', 'bold'
        }
    };
}