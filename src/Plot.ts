/**
 * # Plot class for rendering data series
 * 
 */

/** */

import { Data, NumDomain }  from 'hsdatab';
import { log as gLog }      from 'hsutil';   const log = gLog('d3.Plot');
import { GraphCfg, d3Base } from './ConfigTypes';
import { PlotCfg }          from './ConfigTypes';
import { GraphComponent }   from './GraphComponent'; 
import { BaseType }         from 'd3';

export type d3Selection = d3.Selection<BaseType, unknown, BaseType, unknown>; 

const DEF_RADIUS:number = 5;

export class PlotClass { 
    constructor(desc:PlotCfg, ...params:string[]) {
        const scales = desc.cfg.defaults.scales;
log.info(`PlotClass `);        
        desc.cfg.scales.hor.dataCol = params[0]; // x
        desc.cfg.scales.ver.dataCol = params[1]; // y
        scales[params[0]] = scales[params[0]] || scales.hor || desc.cfg.defaults.defaultScale(0, 1);
        scales[params[1]] = scales[params[1]] || scales.ver || desc.cfg.defaults.defaultScale(0, 1);
    }
    public render(data:Data, series:d3Selection): void {}
}

export abstract class PlotFactory {
    abstract newPlot(desc:PlotCfg, ...params:string[]): PlotClass;
}

export class Plot extends GraphComponent {
    /*------------ Static implementation----- */
    /** a map of plot types to corresponding plot functions. New plot types are added via a call to `register`. */
    protected static plotFnMap: {[plotKey:string]: PlotFactory} = {};

    /** registers a new plot type with corresponding function. */
    public static register(key:string, factory:PlotFactory) {
        this.plotFnMap[key] = factory;
        log.info(`registered plot type '${key}'`);
    }

    /*------------ Instance implementation----- */
    private desc: PlotCfg;
    private series:PlotClass[] = [];

    constructor(cfg:GraphCfg) {
        super(cfg);
        this.desc = {
            cfg: cfg,
            plotBase: cfg.baseSVG.select('.series')
        };
        const margin = this.config.defaults.plot.margin;
        this.desc.plotBase.append('rect').classed('plotRect', true);
    }

    /**
     * adds a series to the plot.
     * @param type type of plot to use, e.g. 'bubble' or 'scatter'
     * @param params the column name of the parameters used to plot the series
     */
    addSeries(type:string, ...params:string[]) {
        const factory = Plot.plotFnMap[type];

        // this.series[seriesKey] = [type].concat(params);
        if (factory) {
            const svg = this.desc.plotBase; 
            svg.append('g').classed(`series${this.series.length}`,true);
            const seriesKey = `${type} ${params.join(' ')}`;
            const plot = factory.newPlot(this.desc, ...params);
            this.series.push(plot);
            log.info(`added series ${this.series.length} as '${seriesKey}'`);
        } else {
            log.error(`unknown plot type ${type}; available types are:\n   '${Object.keys(Plot.plotFnMap).join("'\n   '")}'`);
        }
    }

    /**
     * renders the plot area and all added series using `data`
     * @param data 
     */
    render(data:Data) {
//        this.renderPlotArea();
        const svg = this.desc.cfg.baseSVG; 
        this.series.forEach((s:PlotClass, i:number) => {
            s.render(data, svg.selectAll(`.series${i}`));
        });
    }

    // private renderPlotArea() {
    //     const margin = this.config.defaults.plot.margin;
    //     const plotArea = this.desc.cfg.defaults.plot.area;
    //     this.desc.plotBase.select('.plotRect')
    //         .attr('x', margin.left)
    //         .attr('y', margin.top)
    //         .attr('width', this.desc.cfg.viewPort.width - margin.left - margin.right)
    //         .attr('height',this.desc.cfg.viewPort.height - margin.top - margin.bottom)
    //         .attr('rx', plotArea.rx)
    //         .attr('ry', plotArea.ry)
    //         .attr('stroke', plotArea.stroke.color)
    //         .attr('stroke-width', plotArea.stroke.width)
    //         .attr('stroke-opacity', plotArea.stroke.opacity)
    //         .attr('fill', plotArea.fill.color)
    //         .attr('fill-opacity', plotArea.fill.opacity);
    // }
}