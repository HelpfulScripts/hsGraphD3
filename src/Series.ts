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
 *      return graph.series.types.map(t => m('li', t));
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

import { extent }           from 'd3';
import { log as gLog }      from 'hsutil';   const log = gLog('Series');
import { DataSet }          from './Graph';
import { Domains }          from './Graph';
import { d3Base }           from './Settings';
import { GraphComponent }   from './GraphComponent'; 
import { ComponentDefaults }from './GraphComponent'; 
import { GraphCfg }         from './GraphComponent'; 
import { SeriesPlot }       from './SeriesPlot';
import { CartDimensions }   from './GraphCartesian';
import { schemeDark2 as colors } from 'd3';


export interface SeriesDimensions { [dim:string]: string; }

type PlotFactory = (cfg:GraphCfg, seriesName:string, dims:SeriesDimensions) => SeriesPlot;

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
        this.series.forEach((s:SeriesPlot, i:number) => {
            if ((<DataSet>data).colNames) { s.preRender(<DataSet>data, domains); } 
            else { s.preRender(data[i % this.series.length], domains); }
        });
    } 

    /** renders the component for the given data */
    renderComponent(data:DataSet | DataSet[]) {
        this.series.forEach((s:SeriesPlot, i:number) => {
            if ((<DataSet>data).colNames) { s.renderComponent(<DataSet>data); } 
            else { s.renderComponent(data[i % this.series.length]); }
        });
    }

    /** creates a default entry for the component type in `Defaults` */
    createDefaults():ComponentDefaults {
        return {};
    }

    /** 
     * returns the data domains by data columns across all added series. 
     * @param data the data to calculate domains on
     * @param domains the current data domains will be accumulated to the 
     * provided one under the same data column index. In addition, if domains for the 
     * numeric indices `0`, `1`, ... exist, they will be used to merge and initialize 
     * all series' data columns in the corresponding index. This way, if series use different 
     * data columns to be plotted on the same axis, they all share the same domain accumulation.
     * @return an array of [min, max] domains ranges, indexed by data column
     */
    expandDomain(data:DataSet | DataSet[], domains:Domains):Domains {
        function spread(dom:[number, number]) { dom[0] = 0.9*dom[0]; dom[1] = 1.1*dom[1]; }
        function stretchDomains(dataSet:DataSet, s:SeriesPlot) {
            this.series.forEach((s:SeriesPlot) => {
                const dims:CartDimensions = s.dimensions;
                Object.keys(dims).map(dim => {
                    if (!domains[dim]) { log.warn(`domain not initialized for dimension '${dim}'`); }
                    dims[dim].map(colName => { if (colName) {
                        const col = dataSet.colNames.indexOf(colName);
                        if (col < 0) { log.warn(`did not find column '${colName}' in data set ${dataSet.colNames.join(', ')}`); }
                        else {
                            // domains[dim] = domains[dim] || [1e90, -1e90];
                            const dataDom = extent(dataSet.rows, (r => <number>r[col]));
                            domains[dim][0] = Math.min(domains[dim][0], dataDom[0]);
                            domains[dim][1] = Math.max(domains[dim][1], dataDom[1]);
                            if (domains[dim][1] === domains[dim][0]) { spread(domains[dim]); }
                        }
                    }});
                });
            });
        }

        if ((<DataSet>data).colNames) {  
            // use same dataset for each series
            this.series.forEach((s:SeriesPlot) => stretchDomains.bind(this)(<DataSet>data, s));
        } else {
            // assign dataset to series based on index
            this.series.forEach((s:SeriesPlot, i:number) => {
                const dataSet = data[i % (<DataSet[]>data).length];
                stretchDomains.bind(this)(dataSet, s);
            });
        }
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
            const seriesDefault = this.cfg.defaults.series;
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