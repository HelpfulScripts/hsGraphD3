/**
 * # Sankey Plot
 * 
 * plots Sankley lines. 
 * 
 * ## Usage
 * `graph.series.add('sankey', {keys:[<node-col>, ...], value:<value-col>, color:<color-scheme>});`
 * - `keys` the columns to use as nodes. At least 2 keys are required. The sequence of keys determines the sequence of the graph flow.
 * - `value` is the {@link SeriesPlot.ValueDef value definition}.
 * - `color` is the color scheme to use, e.g. 'cat10'
 * 
 * 
 * ## Example
 * <example height=200px libs={hsGraphD3:'hsGraphD3'}>
 * <file name='script.js'>
 * const data = {
 *    colNames:['from', 'via', 'to', 'count'], 
 *    rows:[['a', 'sheep', 'one', 45], ['b', 'wolf', 'one', 15], ['c', 'sheep', 'two', 22],
 *          ['c', 'sheep', 'one', 40], ['c', 'wolf', 'three', 23], ['a', 'fence', 'three', 5]
 *    ]
 * };
 * const graph = new hsGraphD3.GraphCartesian(root);
 * graph.series.add('sankey', {keys:['from', 'via', 'to'], value:'count', color:'cat10'});
 * graph.render(data);
 * </file>
 * </example>
 */

 /** */

import { Log }                  from 'hsutil'; const log = new Log('Sankey');
import { uniquefy }             from 'hsutil';
import { SeriesPlot }           from '../SeriesPlot';
import { CartSeriesDimensions } from '../CartSeriesPlot';
import { SeriesPlotDefaults }   from '../SeriesPlot';
import { GraphCfg}              from '../GraphComponent';
import { Series }               from '../Series';
import { schemes }              from "../Settings";
import { DataSet, AccessFn, DataVal }              from "../Graph";
import { GraphDimensions }      from "../Graph";
import { Domains }              from "../Graph";
import { d3Base }               from "../Settings";
import { format as d3format}    from 'd3';
import { sankey as d3Sankey }   from "d3-sankey";
import { SankeyNodeMinimal }    from "d3-sankey";
import { SankeyLinkMinimal }    from "d3-sankey";
import { sankeyLinkHorizontal } from "d3-sankey";

Series.register('sankey', (cfg:GraphCfg, sName:string, dims:CartSeriesDimensions) => new Sankey(cfg, sName, dims));
  
export interface SankeyDefaults extends SeriesPlotDefaults {
    width: number;
    padding: number;
}

export class Sankey extends SeriesPlot {
    nodes:SankeyNodeMinimal<{}, {}>[];
    links:SankeyLinkMinimal<{}, {}>[];

    getDefaults(): SankeyDefaults {
        const def = <SankeyDefaults>super.getDefaults();
        def.area.rendered = true;
        def.line.rendered = false;
        def.marker.rendered = true;
        def.label.rendered = false;
        def.width   = 20;
        def.padding = 20;
        return def;
    } 

    get dimensions():GraphDimensions { 
        return {};
    }

    public clearStack(data:DataSet) {
    }

    protected updateStack(data:DataSet) {
    }

    public initialize(svg:d3Base, color?:string): void {
        super.initialize(svg, color);

        // if abscissa data is missing, use implicit index as data
        const r = Math.min(this.cfg.viewPort.width, this.cfg.viewPort.height) / 2;
        if (!this.dims.keys)  { log.error(`no keys defined`); }
        if (!this.dims.value)   { log.error(`no value defined`); }
        this.cfg.graph.defaults.scales.margin.bottom = this.cfg.graph.defaults.scales.margin.top;
    }

    public preRender(data:DataSet, domains:Domains): void {
        const margin = this.cfg.graph.defaults.scales.margin;
        super.preRender(data, domains);
        
        const sankey = d3Sankey()
            .nodeId((d:any) => d.name)
            // .nodeAlign(d3[`sankey${align[0].toUpperCase()}${align.slice(1)}`])
            .nodeWidth((<SankeyDefaults>this.defaults).width)
            .nodePadding((<SankeyDefaults>this.defaults).padding)
            .extent([[margin.left, margin.top], [this.cfg.viewPort.width - margin.left - margin.right, this.cfg.viewPort.height - margin.top - margin.bottom]]);
        const {nodes, links} = sankey(this.createNodesAndLinks(data));
        this.nodes = nodes;
        this.links = links;
    }

    private createNodesAndLinks(data:DataSet):{nodes:any[], links:any[]} {
        const keys = (<string[]>this.dims.keys).map(k => data.colNames.indexOf(k));
        const v = data.colNames.indexOf(<string>this.dims.value);
        const nodes = <{name:string}[]>[];
        const links = <any[]>[];
        const linkByKey = {};
        data.rows.forEach(r => { 
            for (let i=1; i<keys.length; i++) {
                const s = keys[i-1];
                const d = keys[i];
                nodes.push({ name: <string>r[s]});
                nodes.push({ name: <string>r[d]});
                const key = `${s}-${d}`;
                let link = linkByKey[key];
                if (!link) {
                    links.push(link = {
                        source: r[s],
                        target: r[d],
                        names:  [r[s], r[d]],
                        value: 0
                    });
                }
                link.value += r[v];
            }
        });
        return {
            nodes: uniquefy(nodes, 'name'),
            links: links
        };
    }

    /** renders the component for the given data */
    public renderComponent(data:DataSet): void {
        // opportunity to transform data
        super.renderComponent(data);
    }

    public postRender(data:DataSet): void {
        super.postRender(data);
    }


    //-------------------

    protected d3RenderMarkers(plot:d3Base, data:DataSet) {
        const defaults = this.defaults;
        const popup = this.cfg.graph.popup;
        if (defaults.marker.rendered) {
            plot.select('.markers')
                .selectAll("rect")
                .data(this.nodes)
                .join("rect")
                .call(popup.addListener.bind(popup), this.d3RenderPopup(data))
                .transition(this.cfg.transition)
                .call(this.d3DrawMarker.bind(this), data, defaults)
                .call(this.d3MarkerColors.bind(this), data, defaults);
        }
    }

    protected d3RenderFill(plot:d3Base, data:DataSet) {
        const defaults = this.defaults;
        if (defaults.area.rendered) {
            plot.select('.area')
                .selectAll("g")
                .data(this.links)
                .join("path")
                    .style("mix-blend-mode", "multiply")
                    .attr("d", sankeyLinkHorizontal())
                    .attr("stroke", d => defaults.line.color)
                    .attr("stroke-width", d => Math.max(1, d.width))
                    .call(this.d3FillColors.bind(this), data, defaults)
                    .append("title")
                    .text((d:any) => `${d.source.name} → ${d.target.name}`);
        }
    }

    protected d3RenderLabels(plot:d3Base, data:DataSet):void {
        const defaults = this.defaults;
        const width = this.cfg.viewPort.width;
        if (defaults.label.rendered) {
            plot.select('.label')
                .attr("font-family", "sans-serif")
                .attr("font-size", 10)
                .selectAll("text")
                .data(this.nodes)
                .join("text")
                    .attr("x", d => d.x0 < width / 2 ? d.x1 + 6 : d.x0 - 6)
                    .attr("y", d => (d.y1 + d.y0) / 2)
                    // .attr("dy", "0.35em")
                    .attr("text-anchor", d => d.x0 < width / 2 ? "start" : "end")
                    .text((d:any) => d.name);
            }
    }

    protected d3RenderLine(plot:d3Base, data:DataSet) {
    }

    protected d3DrawMarker(markers:d3Base, data:DataSet, defaults:SeriesPlotDefaults) {
        markers.attr("x", (d:any) => d.x0)
               .attr("y", (d:any) => d.y0)
               .attr("height", (d:any) => d.y1 - d.y0)
               .attr("width", (d:any) => d.x1 - d.x0)
               .attr("fill", defaults.marker.fill.color)
               .attr("opacity", defaults.marker.fill.opacity);
                // .append("title")
                //     .text((d:any) => d.name);
    }

    /**
     * formats the popup string to display
     * @param colNames 
     */
    protected d3RenderPopup(data:DataSet):AccessFn {
        return (r:any) => r.name || '???';
    }
}
  