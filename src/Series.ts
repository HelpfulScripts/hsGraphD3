/**
 * # Plot class for rendering data series
 * 
 */

/** */

import { Data }             from 'hsdatab';
import { NumDomain }        from 'hsdatab';
import { log as gLog }      from 'hsutil';   const log = gLog('Plot');
import { d3Base }           from './Defaults';
import { GraphComponent }   from './GraphComponent'; 
import { ComponentDefaults }from './GraphComponent'; 
import { GraphCfg }         from './GraphComponent'; 
import { SeriesPlot }       from './SeriesPlot';


type PlotFactory = (cfg:GraphCfg, svgBase:d3Base, ...params:string[]) => SeriesPlot;

export class Series extends GraphComponent {
    /*------------ Static implementation----- */
    /** a map of plot types to corresponding plot functions. New plot types are added via a call to `register`. */
    protected static seriesCreatorMap: {[plotKey:string]: PlotFactory} = {};

    /** registers a new plot type with corresponding function. */
    public static register(key:string, seriesCreator:PlotFactory) {
        this.seriesCreatorMap[key] = seriesCreator;
        log.info(`registered plot type '${key}'`);
    }

    /*------------ Instance implementation----- */
    private series:SeriesPlot[] = [];

    constructor(cfg:GraphCfg) {
        super(cfg, cfg.baseSVG.select('.series'));
        // this.svg.append('rect').classed('plot', true);
    }

    /** returns the component type as a string name */
    get componentType() { return 'series'; }

    /** renders the component for the given data */
    renderComponent(data:Data) {
        this.series.forEach((s:SeriesPlot, i:number) => {
            s.renderComponent(data);
        });
    }

    /** creates a default entry for the component type in `Defaults` */
    createDefaults():ComponentDefaults {
        return {};
    }

    /** 
     * returns the data domains by data columns across all added series. 
     * @param data the data to calculate domains on
     * @param domains optional; if present, the current data domains will be accumulateds to the 
     * provided one under the same data column index. In addition, if domains for the 
     * numeric indices `0`, `1`, ... exist, they will be used to merge and initialize 
     * all series' data columns in the corresponding index. This way, if series use different 
     * data columns to be plotted on the same axis, they all share the same domain accumulation.
     * @return an array of [min, max] domains ranges, indexed by data column
     */
    expandDomain(data:Data, domains:{[dim:string]: NumDomain} = {}):{[dim:string]: NumDomain} {
        this.series.forEach(s => {
            s.dimensions.map((dim, i) => {
                const dataDom:NumDomain = <NumDomain>data.findDomain(dim);
                if (!domains[dim]) { domains[dim] = domains[i] || [1e90, -1e90]; }
                domains[dim][0] = Math.min(domains[dim][0], dataDom[0]);
                domains[dim][1] = Math.max(domains[dim][1], dataDom[1]);
// log.info(`   dim: ${dataDom[0]}-${dataDom[1]}  ->  ${domains[dim][0]}-${domains[dim][1]}`)                
            });
        });
        return domains;
    }

    
    /**
     * adds a series to the plot.
     * @param type type of plot to use, e.g. 'bubble' or 'scatter'
     * @param params the column name of the parameters used to plot the series
     */
    addSeries(type:string, ...params:string[]) {
        const seriesCreator = Series.seriesCreatorMap[type];
        if (seriesCreator) {
            const seriesKey = `${type} ${params.join(' ')}`;
            const svg = this.svg.append('g').classed(`series${this.series.length}`,true);
            const series = seriesCreator(this.cfg, svg, ...params);
            const seriesDefault = this.cfg.defaults.series;
            const index = this.series.length;
            seriesDefault[index] = seriesDefault[series.key] = series.getDefaults();
            this.series.push(series);
            log.info(`added series ${index} as '${seriesKey}'`);
        } else {
            log.error(`unknown plot type ${type}; available types are:\n   '${Object.keys(Series.seriesCreatorMap).join("'\n   '")}'`);
        }
    }
}