/**
 * 
 */

/** */

import { DataSet, Graph }   from './Graph';
import { LifecycleCalls }   from './Graph';
import { d3Base }           from './Settings';
import { UnitVp }           from './Settings';
import { Selection }        from 'd3';
import { BaseType }         from 'd3';
import { Scales } from './Scales';
import { Canvas } from './Canvas';
import { Grids } from './Grid';
import { Axes } from './Axis';
import { Series } from './Series';
import { Title } from './Title';
import { Popup } from './Popup';


export interface SVGLineSelection extends Selection<SVGLineElement, number, BaseType, unknown> {}
export interface SVGCircleSelection extends Selection<SVGCircleElement, number, BaseType, unknown> {}


type pixel = number;

export interface Components {
    scales:Scales;
    canvas:Canvas;
    grids:Grids;
    axes:Axes;
    series:Series;
    title:Title;
    popup:Popup;
}


/** 
 * Configuration parameters for the render tree, passed to each `GraphComponent` during construction. 
 */
export interface GraphCfg {
    /** the base svg for the rendering tree */
    baseSVG:    d3Base;

    /** the `graph` object that this config belongs to. */
    graph:      Graph;

    /** the set of graph components used  */
    components: Components,

    /** dimensions of the HTML client rect containing this graph in pixel. */
    client:     { x:pixel; y:pixel; width:pixel; height:pixel; };

    /** top level svg viewBox dimensions in viewport units*/
    viewPort: {
        orgX:   UnitVp;
        orgY:   UnitVp;
        width:  UnitVp;
        height: UnitVp;
    };

    /** Default settings for GraphComponents in this graph */
    // defaults: DefaultsType;

    // /** 
    //  * mapping of semantic scales to data columns and scaling functions. 
    //  * The scaling function will be set at rendering time for each new rendering frame.
    //  * @param dim *string* the semantic name of the axis to plot and scale. E.g. for 2D cartesian plots, 
    //  * `dim` is `hor`, `ver`, or `size`. 
    //  */    
    // scales: { [dim:string]: Scale};

    /**
     * used to aggregate series into grouped stacks. 
     */
    stack: { [group:string]: {[abscissa:string]:number}; };

    /** the currently used transition. A new transition will be set each time `Graph.render()` is called. */
    transition: any;
}

/**
 * Generic base interface for the default setting for all component types.
 */
export interface ComponentDefaults {
}

export abstract class GraphBase implements LifecycleCalls {
    /** the render tree configuration */
    protected cfg: GraphCfg;

    constructor(cfg:GraphCfg) { 
        this.cfg = cfg; 
    }

    /** creates a default entry for the component type in `Defaults` */
    abstract createDefaults(): ComponentDefaults;

    /** getter for the defaults. */
    abstract get defaults(): ComponentDefaults;

    //************** Lifecycle calls **************************/

    /** called once during creation of the `Graph`. m*/
    abstract initialize(svg:d3Base): void;

    /** Called immediately before each call to renderComponent. */
    abstract preRender(data:DataSet | DataSet[]): void; 

    /** renders the component. */
    abstract renderComponent(data:DataSet | DataSet[]): void;

    /** Called immediately after each call to renderComponent. */
    abstract postRender(data:DataSet | DataSet[]): void; 
}

/**
 * Generic base class for all component types
 */
export abstract class GraphComponent extends GraphBase {
    /** the base svg element to render the component into */
    protected svg: d3Base;
    
    constructor(cfg:GraphCfg, compClass:string) { 
        super(cfg); 
        if (compClass) { 
            this.svg = this.cfg.baseSVG.append('g').classed(compClass, true);
        } else if (compClass !== null) {
            console.log('no CompClass');
            console.log(new Error().stack);
        }
    }

    /** returns the component type as a string name */
    abstract get componentType(): string;
}

