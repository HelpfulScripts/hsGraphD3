/**
 * # Series 
 * A `GraphComponent` responsible for plotting all added series.  
 * 
 * ## Available plot types:
 * <example libs={hsGraphD3:'hsGraphD3'}>
 * <file name='script.js'>
 * const log = hsUtil.log('');
 * let types;
 * 
 * function getTypes(svgRoot) {
 *      const graph = new hsGraphD3.GraphCartesian(svgRoot);
 *      return graph.seriesTypes.map(t => m('li', t));
 * }
 * 
 * m.mount(root, {
 *   view:() => m('div', {style:'background-color:#fff;'}, [
 *      m('ul', types), 
 *      m('div.myGraph', '')
 *   ]),
 *   oncreate: () => {
 *      const svgRoot = root.getElementsByClassName('myGraph');
 *      if (svgRoot && svgRoot.length && !types) { 
 *          types = getTypes(svgRoot[0]);
 *      }
 *   } 
 * });
 * </file>
 * </example>
 */

/** */

import { log as gLog }          from 'hsutil';   const log = gLog('Series');
import { DataSet }              from './Graph';
import { ValueDef }             from './Graph';
import { Domains }              from './Graph';
import { d3Base }               from './Settings';
import { GraphComponent }       from './GraphComponent'; 
import { ComponentDefaults }    from './GraphComponent'; 
import { GraphCfg }             from './GraphComponent'; 
import { SeriesPlot }           from './SeriesPlot';
import { schemeDark2 as colors }from 'd3';

/**
 * The `SeriesDimensions` that specify the values to use for different 
 * semantic dimension (e.g. 'x' for the x-axis) of 
 * each {@link SeriesPlot `SeriesPlot`}.
 * For each dimension, the value can be either 
 * - a string that identifies the column name in the data set to use
 * - or a number constant 
 */
export interface SeriesDimensions { [dim:string]: ValueDef; }

type PlotFactory = (cfg:GraphCfg, seriesName:string, dims:SeriesDimensions) => SeriesPlot;

export interface SeriesDefaults extends ComponentDefaults {
    /** used with `OrdinalSeriesPlot`, defines ordinal-specific defaults */
    ordinal?: {
        /** 
         * gap width between mutliple series
         * as a ration between 0 (no gap) and 1 (all gap). 
         * */
        gap:   number;  

        /** 
         * overlap between multiple series, 
         * between 0 (no overlap) and 1 (complete overlap) 
         */
        overlap: number;
    };
}


export class Series extends GraphComponent {
    static type = 'series';

    /*------------ Static implementation----- */
    /** a map of plot types to corresponding plot functions. New plot types are added via a call to `register`. */
    protected static seriesCreatorMap: {[plotKey:string]: PlotFactory} = {};

    /** registers a new plot type with corresponding function. */
    public static register(key:string, seriesCreator:PlotFactory) {
        if (this.seriesCreatorMap[key]) {
            this.seriesCreatorMap[key] = seriesCreator;
            log.debug(`re-registered plot type '${key}'`);    
        } else {
            this.seriesCreatorMap[key] = seriesCreator;
            log.debug(`registered plot type '${key}'`);
        }
    }

    public static get types():string[] { return Object.keys(this.seriesCreatorMap); }

    /*------------ Instance implementation----- */
    private series:SeriesPlot[] = [];

    constructor(cfg:GraphCfg) {
        super(cfg, Series.type);
    }

    /** returns the component type as a string name */
    get componentType() { return Series.type; }

    initialize(svg:d3Base): void {
        // swap 0 <-> 1, 2 <-> 3, etc.
        // const colorSwap = (i:number) => ((i+1)%2)+ (Math.floor(i/2+0.001))*2;
        const seriesSVG = svg.selectAll(`.${this.componentType}`);
        this.series.forEach((s:SeriesPlot, i:number) => s.initialize(seriesSVG, colors[i % colors.length]));
    } 

    preRender(data:DataSet | DataSet[], domains:Domains): void {
        this.series.forEach((s:SeriesPlot, i:number) => 
            s.preRender((<DataSet>data).colNames? data : data[i % this.series.length], domains) 
        );
    } 

    /** 
     * renders the component for the given data.
     * If `data` is an array of `DataSets`, each data set will be used to plot a different registered series, 
     * in the order they were regeistered.
     */
    renderComponent(data:DataSet | DataSet[]) {
        this.series.forEach((s:SeriesPlot, i:number) => s.renderComponent((<DataSet>data).colNames? 
            data : data[i % this.series.length]
        ));
    }

    postRender(data:DataSet | DataSet[]) {
        this.series.forEach((s:SeriesPlot, i:number) => s.postRender((<DataSet>data).colNames? 
            data : data[i % this.series.length]
        ));
    }

    /** creates a default entry for the component type in `Defaults` */
    createDefaults():ComponentDefaults {
        return {
            ordinal: {
                gap: 0.1,      // [0,1]
                overlap: 0,    // [0,1]
            }
        };
    }

    /** 
     * Called during preRendering, prior to all component preRender calls.
     * Returns the data domains by data columns across all added series. 
     * @param data the data to calculate domains on
     * @param domains the current data domains will be accumulated to the 
     * provided one under the same data column index. In addition, if domains for the 
     * numeric indices `0`, `1`, ... exist, they will be used to merge and initialize 
     * all series' data columns in the corresponding index. This way, if series use different 
     * data columns to be plotted on the same axis, they all share the same domain accumulation.
     * @return an array of [min, max] domains ranges, indexed by data column
     */
    expandDomains(data:DataSet | DataSet[], domains:Domains):Domains {
        this.series.forEach((s:SeriesPlot) => s.clearStack());
        if ((<DataSet>data).colNames) {  
            // use same dataset for each series
            this.series.forEach((s:SeriesPlot) => s.expandDomains(<DataSet>data, domains));
        } else {
            // assign dataset to series based on index
            this.series.forEach((s:SeriesPlot, i:number) => {
                const dataSet = data[i % (<DataSet[]>data).length];
                s.expandDomains(dataSet, domains);
            });
        }
        // reset the stack.
        this.series.forEach((s:SeriesPlot) => s.clearStack());
        return domains;
    }
    
    /**
     * adds a series to the plot.
     * @param type type of plot to use, e.g. 'bubble' or 'scatter'
     * @param params the column name of the parameters used to plot the series
     */
    addSeries(type:string, dims:SeriesDimensions):SeriesPlot {
        const seriesCreator = Series.seriesCreatorMap[type];
        if (seriesCreator) {
            const series = seriesCreator(this.cfg, `${Series.type}${this.series.length}`, dims);
            const seriesDefault = <SeriesDefaults>this.cfg.defaults.series;
            const index = this.series.length;
            seriesDefault[index] = seriesDefault[series.key] = series.getDefaults();
            this.series.push(series);
            log.debug(`added series ${index} on '${log.inspect(dims, null)}'`);
            return series;
        } else {
            log.error(`unknown plot type ${type}; available types are:\n   '${Object.keys(Series.seriesCreatorMap).join("'\n   '")}'`);
        }
    }
}