/**
 * # Plot class for rendering data series
 * 
 */

/** */

import { Data }             from 'hsdatab';
import { log as gLog }      from 'hsutil';   const log = gLog('Plot');
import { d3Base }           from './ConfigTypes';
import { GraphComponent }   from './GraphComponent'; 
import { ComponentDefaults }from './GraphComponent'; 
import { GraphCfg }         from './GraphComponent'; 
import * as def             from './Defaults';
import { SeriesPlot }       from './SeriesPlot';
import { SeriesDefaults }   from './SeriesPlot';


const DEF_RADIUS:number = 5;

export interface PlotDefaults extends ComponentDefaults {
    // area: RectStyle;
}

type PlotFactory = (cfg:GraphCfg, svgBase:d3Base, ...params:string[]) => SeriesPlot;
// export abstract class PlotFactory {
//     abstract newSeries(cfg:GraphCfg, svgBase:d3Base, ...params:string[]): Series;
// }

export class Series extends GraphComponent {
    /*------------ Static implementation----- */
    /** a map of plot types to corresponding plot functions. New plot types are added via a call to `register`. */
    protected static plotFnMap: {[plotKey:string]: PlotFactory} = {};

    /** registers a new plot type with corresponding function. */
    public static register(key:string, factory:PlotFactory) {
        this.plotFnMap[key] = factory;
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
    createDefaults() {
        def.Defaults.addComponentDefaults('series', <SeriesDefaults[]>[]);
    }
    
    /**
     * adds a series to the plot.
     * @param type type of plot to use, e.g. 'bubble' or 'scatter'
     * @param params the column name of the parameters used to plot the series
     */
    addSeries(type:string, ...params:string[]) {
        const factory = Series.plotFnMap[type];
        if (factory) {
            const seriesKey = `${type} ${params.join(' ')}`;
            const svg = this.svg.append('g').classed(`series${this.series.length}`,true);
            const series = factory(this.cfg, svg, ...params);
            const seriesDefault = this.cfg.defaults('series');
            const index = this.series.length;
            seriesDefault[index] = seriesDefault[seriesKey] = series.getDefaults();
            this.series.push(series);
            log.info(`added series ${index} as '${seriesKey}'`);
        } else {
            log.error(`unknown plot type ${type}; available types are:\n   '${Object.keys(Series.plotFnMap).join("'\n   '")}'`);
        }
    }
}