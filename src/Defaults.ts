/**
 * # Defaults Configuration
 * 
 */

/** */

import * as d       from './DefaultTypes';
import { UnitVp }   from './ConfigTypes';
import { GraphCfg } from './ConfigTypes';


/**
 * Create a `Config` object and populate it with default values.
 */
export class Defaults {
    // private axes = {};
    // private config: GraphCfg;
    // private theScales = {};

    constructor(protected config: GraphCfg) { }

    graph:d.GraphDefaults = {
        canvas: defaultRect('#fff', 2, '#ccc')
    };

    plot:d.PlotDefaults = {
        area: defaultRect('#fff'),
        margin: { left:10, top:10, right:10, bottom:10}
    };

    series:d.SeriesDefaults[] = [];

    axes:d.AxesDefaults = { 
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

    grid:d.GridDefaults = {
        hor: {
            major: defaultLine(1,'#444'),
            minor: defaultLine(2, '#eee')
        },
        ver: {
            major: defaultLine(1,'#444'),
            minor: defaultLine(2, '#eee')
        }
    };

    scales:{[column:string]: d.ScaleDefaults} = {
        hor: this.defaultScale(0, this.config.viewPort.width),
        ver: this.defaultScale(0, this.config.viewPort.height)
    };

    defaultScale(minRange=0, maxRange=1):d.ScaleDefaults { 
        return {
            type:   'linear',
            domain: {min: 'auto', max: 'auto'}, //  data domain
            range:  { min: minRange, max: maxRange }          //  canvas range
        };
    }
}

export function defaultLine(width:UnitVp, color:d.Color='#000'):d.Line {
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
function defaultRect(area:d.Color, borderWidth:UnitVp=0, borderColor:d.Color='#fff'):d.RectStyle {
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

function defaultText():d.TextStyle {
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