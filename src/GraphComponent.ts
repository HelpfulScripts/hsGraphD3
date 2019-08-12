/**
 * 
 */

/** */

import { Data }     from 'hsdatab';
import * as ct      from './ConfigTypes';
import { Defaults } from './Defaults';

/** 
 * Configuration parameters for the render tree, passed to each `GraphComponent` during construction. 
 */
export interface GraphCfg {
    /** the base svg for the rendering tree */
    baseSVG:    ct.d3Base;

    /** dimensions of the HTML client rect containing this graph */
    client:     ct.RectDef;

    /** top level svg viewBox dimensions */
    viewPort: {
        width:  ct.UnitVp;
        height: ct.UnitVp;
    };

    /** Default settings for GraphComp[onents in this graph] */
    defaults:   (compName?:string) => ComponentDefaults;

    /** 
     * mapping of semantic scales to data columns and scaling functions. 
     * The scaling function will be set at rendering time for each new rendering frame.
     * @param dim the semantic name of the axis to plot and scale. E.g. for 2D cartesian plots, `dim` is `hor` or `ver`.
     * @param dataCol the name of the data column that will be plotted along this axis
     * @param scale a d3js scale used for scaling
     */    
    scales: { [dim:string]:  { dataCol: string, scale: d3.ScaleContinuousNumeric<number, number>}};
}

/**
 * Generic base interface for the default setting for all component types.
 */
export interface ComponentDefaults {
}

/**
 * Generic base class for all component types
 */
export abstract class GraphComponent {
    /** the base svg element to render the component into */
    protected svg: ct.d3Base;
    
    /** the render tree configuration */
    protected cfg: GraphCfg;

    constructor(cfg:GraphCfg, svgBase:ct.d3Base) { 
        this.cfg = cfg; 
        this.svg = svgBase; 
    }

    /** returns the component type as a string name */
    abstract get componentType(): string;

    /** renders the component for the given data */
    abstract renderComponent(data:Data): void;

    /** creates a default entry for the component type in `Defaults` */
    abstract createDefaults(): ComponentDefaults;
}

