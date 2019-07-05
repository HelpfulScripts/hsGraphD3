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
    private axes = {};
    private config: GraphCfg;
    private scales = {};

    constructor(config: GraphCfg) {}

    get Graph():GraphDefaults {
        return { canvas: defaultRect('#fff', 2, '#ccc') };
    }

    get Plot():PlotDefaults {
        return { area: defaultRect('#fff') };
    }

    get Series():SeriesDefaults[]  {
        return [];
    }

    get Axes():AxesDefaults { return {
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
    };}

    Scales(dataCol: string):ScaleDefaults {
        return this.scales[dataCol] = this.scales[dataCol] || defaultScale(0, 100);
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

function defaultScale(minRange: number, maxRange:number):ScaleDefaults { return {
    type:   'linear',
    domain: {min: 'auto', max: 'auto'},
    range:  { min: minRange, max: maxRange }
};}

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