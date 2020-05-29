/**
 * # SeriesPlotPolar
 * 
 * Abstract base class for all series plot types on polar coordinates.
 * To create a series plot, add the desired plot type to the graph:
 * ```
 * graph.add(<type>, {<dim>: <ValueDef>, ...});
 * ``` 
 * - `<type>` is one of the registered types: 
 *     - &nbsp; {@link plots.Pie `pie`} a pie chart
 * - `<dim>` is the semantic dimension to set. See {@link SeriesPlotPolar.PolarSeriesDimensions PolarSeriesDimensions} for valid dimensions. 
 * - `<ValueDef>` is the {@link SeriesPlot.ValueDef value definition}. 
 * 
 * ### Example:
 * <example height=200px libs={hsGraphD3:'hsGraphD3'}>
 * <file name='script.js'>
 * // create data set:
 * const data = {
 *      colNames: ['date', 'time', 'volume', 'costs'], 
 *      rows: [
 *          ['1/1/14', -1,   0.2, 0.3], 
 *          ['1/1/16', -0.2, 0.7, 0.2], 
 *          ['9/1/16', 0.4,  0.1, 0.3],
 *          ['5/1/17', 0.6, -0.2, 0.1], 
 *          ['7/1/18', 0.8,  0.3, 0.5], 
 *          ['1/1/19', 1,    0.2, 0.4]
 *      ]
 * }  
 * 
 * // setup and plot the data:
 * const graph = new hsGraphD3.Graph(root);
 * graph.add('line', {x:'time', y:'volume'},);
 * graph.add('line', {x:'time', y:'costs'});
 * 
 * with (graph.canvas.defaults) {
 *      fill.color = '#fcfcfc';
 *      stroke.width = 10;  // in viewport coordinates (0 - 1000)
 * }
 * 
 * // series defaults can be indexed by position or by name. Names are created as `series`+position index.
 * graph.series.defaults[0].marker.size = 15;
 * graph.series.defaults[0].marker.fill.color = '#66f';
 * graph.series.defaults[0].marker.stroke.color = '#00f';
 * graph.series.defaults.series0.line.width = 5;
 * graph.series.defaults.series0.line.color = '#00c';
 * 
 * graph.series.defaults.series1.marker.size = 10;
 * graph.series.defaults.series1.marker.fill.color = '#6f6';
 * graph.series.defaults.series1.marker.stroke.color = '#0a0';
 * graph.series.defaults.series1.line.width = 5;
 * graph.series.defaults[1].line.color = '#0c0';
 * 
 * graph.render(data).update(2000, data => {
 *    data.rows.map(row => {
 *      row[2] = 2*(Math.random()-0.5); // -1...1
 *      row[3] = Math.random();         //  0...1
 *    });
 *    return true;
 * });
 * 
 * </file>
 * </example>
 * 
 * ### Polar Plot Default Settings:
 * <example height=300px libs={hsGraphD3:'hsGraphD3', hsUtil:'hsUtil'}>
 * <file name='script.js'>
 * const log = new hsUtil.Log('');
 * let defaults;
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
 *          const graph = new hsGraphD3.Graph(svgRoot[0]);
 *          defaults = log
 *              .inspect(graph.defaults)
 *              .replace(/\n/g, '<br>')
 *      }
 *   } 
 * });
 * </file>
 * </example>
 */


/** */

import { Log }                  from 'hsutil'; const log = new Log('SeriesPlotPolar');
import { SeriesPlotDefaults }   from "./SeriesPlot";
import { SeriesDimensions }     from "./SeriesPlot";
import { ValueDef }             from "./SeriesPlot";
import { GraphDimensions }      from "./Graph";
import { DataSet }              from "./Graph";
import { Domains }              from "./Graph";
import { GraphCfg }             from "./GraphComponent";
import { d3Base, Radians }      from "./Settings";
import { defaultStroke }        from "./Settings";
import { SeriesPlotScaled } from './SeriesPlotScaled';

/**
 * valid {@link SeriesPlot.ValueDef `Value Definiton`} dimensions on polar plots:
 * - `phi`?:  optional values for the angular axis. If omitted, equal angular values will be used.
 * - `r`:   values for the radial axis.
 * - `r0`?: optional values for lower fill border on the  radial axis; defaults to `0`
 * </ul>
 * Inherited from {@link SeriesPlot.SeriesDimensions SeriesDimensions}:<ul>
 * - `label`?: optional values for item {@link SeriesPlot.SeriesDimensions.label labels}
 * - `popup`?: optional values to show in mouse-over {@link SeriesPlot.SeriesDimensions.popup popups}.
 * - `color`?: optional values to determine {@link SeriesPlot.SeriesDimensions.color marker colors}
 * - `stacked`?: optional {@link SeriesPlot.SeriesDimensions.stacked stack group}. 
 *    Series with the same group will be stacked on each other
 */
export interface PolarSeriesDimensions extends SeriesDimensions {
    /** 
     * optional, name of angular axis data column, or a function returning a value.
     * If omitted, the index of  radial values will be used as angular values.
     */
    phi?:   ValueDef;    
    /** name of radial axis data column, or a function returning a value */
    r:   ValueDef;    
    /** optional, name of  radial axis data column for lower fill border, or a function returning a value */
    r0?:   ValueDef;    
}

export interface PolarPlotDefaults extends SeriesPlotDefaults {
    cornerRadius: number;
    padAngle: Radians;

}

export interface PolarDimensions extends GraphDimensions { 
    ang:ValueDef[]; 
    rad:ValueDef[]; 
}


/**
 * Abstract base class for all cartesian plots.
 */
export abstract class SeriesPlotPolar extends SeriesPlotScaled {

    constructor(cfg:GraphCfg, seriesName:string, dims:PolarSeriesDimensions) {
        super(cfg, seriesName, dims);
        this.type = 'polar';
    }

    protected get dims(): PolarSeriesDimensions { return <PolarSeriesDimensions>super.dims; }

    /** return the GraphDimension of the independent axis */
    protected abscissa:'ang'|'rad' = 'ang';

    /** return the list of scalable Series dimesions for each Graph Dimension */
    get dimensions():PolarDimensions { 
        return {
            ang: [this.dims.phi],
            rad: [this.dims.r, this.dims.r0]
        };
    }

    /** 
     * Set the defaults for the series. Called during `series.add`.
     * */
    public getDefaults(): SeriesPlotDefaults {
        const def = super.getDefaults();
        def.marker.rendered = true; 
        def.marker.stroke = defaultStroke(1);
        if (this.dims.label){ 
            def.label.rendered = true; 
            def.label.color = '#000';
        }
        return def;
    }

    public expandDomains(dataSet:DataSet, domains:Domains) {
        super.expandDomains(dataSet, domains);
        // in addition: ensure that min radius is 0.
        const type = this.cfg.graph.defaults.scales.dims['rad'].type;
        if (type === 'linear') { domains['rad'][0] = 0; }
    }

    getStackDim(v:ValueDef) { return this.dimensions[this.abscissa==='ang'? 'rad' : 'ang'].indexOf(v)>=0; }
    getAbscissaCol() { return {ang:this.dims.phi, rad:this.dims.r}[this.abscissa]; }
    getOrdinateCol() { return {ang:this.dims.r,   rad:this.dims.phi}[this.abscissa]; }


    //---------- lifecylce methods --------------------

    public initialize(svg:d3Base, color?:string): void {
        super.initialize(svg, color);

        // if abscissa data is missing, use implicit index as data
        const r = Math.min(this.cfg.viewPort.width, this.cfg.viewPort.height) / 2;
        if (!this.dims.phi)   { this.dims.phi = 1; /*+Math.random()/100;*/ }
        if (!this.dims.r)     { this.dims.r = this.abscissa === 'ang'? ()=>r : 1; }
        if (!this.dims.r0)    { this.dims.r0 = 0; }
        if (!this.dims.popup) { this.dims.popup = {ang: this.dims.r, rad: this.dims.phi}[this.abscissa]; }
    }
}
