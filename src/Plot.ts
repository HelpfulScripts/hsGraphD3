/**
 * # Plot class for rendering data series
 * 
 */

/** */

import { Data, NumDomain }  from 'hsdatab';
import { log as gLog }      from 'hsutil';   const log = gLog('d3.Plot');
import { GraphCfg, PlotFn } from './ConfigTypes';
import { PlotFnDef }        from './ConfigTypes';
import { PlotCfg }          from './ConfigTypes';
import { UnitVp }           from './ConfigTypes';
import { GraphComponent }   from './GraphComponent'; 

/** import and register 'bubble' plot */
import { bubble }           from './bubble'; 

const DEF_RADIUS:number = 5;

export class Plot extends GraphComponent {
    /*------------ Static implementation----- */
    /** a map of plot types to corresponding plot functions. New plot types are added via a call to `register`. */
    protected static plotFnMap: any = {};

    /** registers a new plot type with corresponding function. */
    public static register(key:string, fn:PlotFnDef) {
        this.plotFnMap[key] = fn;
        log.info(`registered plot type '${key}'`);
    }

    /*------------ Instance implementation----- */
    private desc: PlotCfg;
    private series:PlotFn[] = [];

    constructor(cfg:GraphCfg) {
        super(cfg);
        this.desc = {
            cfg: cfg,
            margin: { left:0, top:0, right:0, bottom:0},
            plotBase: cfg.baseSVG.append('svg').classed('plotSVG', true)
        };
        const margin = this.desc.margin;
        this.desc.plotBase.append('rect').classed('plotRect', true);
        Plot.register('bubble', bubble);
    }

    setBorders(left:UnitVp, top:UnitVp, right:UnitVp, bottom:UnitVp) {
        const margin = this.desc.margin;
        margin.left     = left;
        margin.right    = right;
        margin.top      = top;
        margin.bottom   = bottom;
    }

    /**
     * adds a series to the plot.
     * @param type type of plot to use, e.g. 'bubble' or 'scatter'
     * @param params the column name of the parameters used to plot the series
     */
    addSeries(type:string, ...params:string[]) {
        const fn = Plot.plotFnMap[type];
        const seriesKey = `${type} ${params.join(' ')}`;
        this.series[seriesKey] = [type].concat(params);
        if (fn) {
            this.series.push((data:Data) => fn(data, this.desc, ...params));
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
        this.renderPlotArea();
        this.series.forEach((s:PlotFn) => s(data));
    }

    private renderPlotArea() {
        const margin = this.desc.margin;
        const plotArea = this.desc.cfg.defaults.Plot.area;
        this.desc.plotBase.select('.plotRect')
            .attr('x', margin.left)
            .attr('y', margin.top)
            .attr('width', this.desc.cfg.viewPort.width - margin.left - margin.right)
            .attr('height',this.desc.cfg.viewPort.height - margin.top - margin.bottom)
            .attr('rx', plotArea.rx)
            .attr('ry', plotArea.ry)
            .attr('stroke', plotArea.stroke.color)
            .attr('stroke-width', plotArea.stroke.width)
            .attr('stroke-opacity', plotArea.stroke.opacity)
            .attr('fill', plotArea.fill.color)
            .attr('fill-opacity', plotArea.fill.opacity);
    }
}