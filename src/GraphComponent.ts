/**
 * 
 */

/** */

import { Data }         from 'hsdatab';
import { DefaultsType } from './Settings';
import { d3Base }       from './Settings';
import { RectDef }      from './Settings';
import { UnitVp }       from './Settings';
import { LifecycleCalls } from './AbstractGraph';


/** 
 * Configuration parameters for the render tree, passed to each `GraphComponent` during construction. 
 */
export interface GraphCfg {
    /** the base svg for the rendering tree */
    baseSVG:    d3Base;

    /** dimensions of the HTML client rect containing this graph */
    client:     RectDef;

    /** top level svg viewBox dimensions */
    viewPort: {
        width:  UnitVp;
        height: UnitVp;
    };

    /** Default settings for GraphComp[onents in this graph] */
    defaults: DefaultsType;
    // defaults:   (compName?:string) => ComponentDefaults;

    /** 
     * mapping of semantic scales to data columns and scaling functions. 
     * The scaling function will be set at rendering time for each new rendering frame.
     * @param dim the semantic name of the axis to plot and scale. E.g. for 2D cartesian plots, `dim` is `hor` or `ver`.
     * @param dataCol the name of the data column that will be plotted along this axis
     * @param scale a d3js scale used for scaling
     */    
    scales: { [dim:string]:  d3.ScaleContinuousNumeric<number, number>};
}

/**
 * Generic base interface for the default setting for all component types.
 */
export interface ComponentDefaults {
    [filed:string]:any;
}

/**
 * Generic base class for all component types
 */
export abstract class GraphComponent implements LifecycleCalls {
    /** the base svg element to render the component into */
    protected svg: d3Base;
    
    /** the render tree configuration */
    protected cfg: GraphCfg;

    constructor(cfg:GraphCfg, compClass:string) { 
        this.cfg = cfg; 
        if (compClass) {
            this.cfg.baseSVG.append('g').classed(compClass, true);
        }
        this.svg = this.cfg.baseSVG.select(`.${compClass}`);
    }

    /** returns the component type as a string name */
    abstract get componentType(): string;

    /** creates a default entry for the component type in `Defaults` */
    abstract createDefaults(): ComponentDefaults;

    //************** Lifecycle calls **************************/

    /** called once during creation of the `Graph`. m*/
    abstract initialize(svg:d3Base): void;

    /** Called immediately before each call to renderComponent. */
    abstract preRender(data:Data): void; 

    /** renders the component. */
    abstract renderComponent(data:Data): void;
}

