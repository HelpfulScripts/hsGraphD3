/**
 * # Sankey Plot
 * 
 * plots Sankley lines. 
 * 
 * ## Usage
 * `graph.add('sankey', {keys:[<node-col>, ...], value:<value-col>, color:<color-scheme>});`
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
 * const graph = new hsGraphD3.Graph(root);
 * graph.add('sankey', {keys:['from', 'via', 'to'], value:'count', color:'cat10'});
 * graph.render(data);
 * </file>
 * </example>
 * 
 * ## Example 2: Left aligned
 * <example height=200px libs={hsGraphD3:'hsGraphD3'}>
 * <file name='script.js'>
 * const data = {
 *    colNames:['from', 'to', 'count'], 
 *    rows:[['a', 'sheep', 45], ['sheep', 'one',   45],
 *          ['b', 'one',  15], 
 *          ['c', 'sheep', 22], ['sheep', 'two',   22],
 *          ['c', 'sheep', 40], ['sheep', 'one',   40], 
 *          ['c', 'cow',  23],  ['wolf',  'three', 23], 
 *          ['a', 'fence',  5], ['fence', 'three',  5]
 *    ]
 * };
 * const graph = new hsGraphD3.Graph(root);
 * graph.add('sankey', {keys:['from', 'to'], value:'count', color:'cat10'});
 * graph.defaults.series.series0.align = 'left';
 * graph.render(data);
 * </file>
 * </example>
 * 
 * ## Example 3: Right aligned
 * <example height=200px libs={hsGraphD3:'hsGraphD3'}>
 * <file name='script.js'>
 * const data = {
 *    colNames:['from', 'to', 'count'], 
 *    rows:[['a', 'sheep', 45], ['sheep', 'one',   45],
 *          ['b', 'one',  15], 
 *          ['c', 'sheep', 22], ['sheep', 'two',   22],
 *          ['c', 'sheep', 40], ['sheep', 'one',   40], 
 *          ['c', 'cow',  23],  ['wolf',  'three', 23], 
 *          ['a', 'fence',  5], ['fence', 'three',  5]
 *    ]
 * };
 * const graph = new hsGraphD3.Graph(root);
 * graph.add('sankey', {keys:['from', 'to'], value:'count', color:'cat10'});
 * graph.defaults.series.series0.align = 'right';
 * graph.render(data);
 * </file>
 * </example>
 */

 /** */

import { Log }                  from 'hsutil'; const log = new Log('Sankey');
import { SeriesPlot }           from '../SeriesPlot';
import { CartSeriesDimensions } from '../SeriesPlotCartesian';
import { SeriesPlotDefaults }   from '../SeriesPlot';
import { GraphCfg}              from '../GraphComponent';
import { Series }               from '../Series';
import { DataSet, AccessFn }    from "../Graph";
import { GraphDimensions }      from "../Graph";
import { d3Base }               from "../Settings";
import { sankey as d3Sankey }   from "d3-sankey";
import { SankeyNodeMinimal }    from "d3-sankey";
import { SankeyLinkMinimal }    from "d3-sankey";
import { sankeyLinkHorizontal } from "d3-sankey";
import { sankeyLeft }           from "d3-sankey";
import { sankeyRight }          from "d3-sankey";
import { sankeyCenter }         from "d3-sankey";
import { sankeyJustify }        from "d3-sankey";

Series.register('sankey', (cfg:GraphCfg, sName:string, dims:CartSeriesDimensions) => new Sankey(cfg, sName, dims));
  
export interface SankeyDefaults extends SeriesPlotDefaults {
    width: number;
    padding: number;
    align: 'left' | 'right' | 'center' | 'justified';
}

interface Nodes {
    [index:number]:string,
    names: {}
}


export class Sankey extends SeriesPlot {
    nodes:SankeyNodeMinimal<{}, {}>[];
    links:SankeyLinkMinimal<{}, {}>[];
    sankey:any;
    align = sankeyJustify;

    constructor(cfg:GraphCfg, seriesName:string, dims:CartSeriesDimensions) {
        super(cfg, seriesName, dims);
        this.type = 'none';
    }

    getDefaults(): SankeyDefaults {
        const def = <SankeyDefaults>super.getDefaults();
        def.area.rendered = true;
        def.line.rendered = false;
        def.marker.rendered = true;
        def.label.rendered = false;
        def.width   = 20;
        def.padding = 20;
        def.align   = 'justified'; 
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

    public preRender(data:DataSet): void {
        super.preRender(data);
        const margin = this.cfg.graph.defaults.scales.margin;
        switch((<SankeyDefaults>this.defaults).align) {
            case 'left':        this.align = sankeyLeft; break;
            case 'right':       this.align = sankeyRight; break;
            case 'center':      this.align = sankeyCenter; break;
            case 'justified':   this.align = sankeyJustify; break;
        }
        if (this.sankey) {
            this.sankey.update(this.createNodesAndLinks(data))
        } else {
            this.sankey = d3Sankey()
                .nodeId((d:any) => d.name)
                .nodeAlign(this.align)
                .nodeWidth((<SankeyDefaults>this.defaults).width)
                .nodePadding((<SankeyDefaults>this.defaults).padding)
                .extent([[margin.left, margin.top], [this.cfg.viewPort.width - margin.left - margin.right, this.cfg.viewPort.height - margin.top - margin.bottom]]);
            const {nodes, links} = this.sankey(this.createNodesAndLinks(data));
            this.nodes = nodes;
            this.links = links;
        }
    }

    private createNodesAndLinks(data:DataSet):{nodes:Nodes, links:any[]} {
        const keys = (<string[]>this.dims.keys).map(k => data.colNames.indexOf(k));
        const v = data.colNames.indexOf(<string>this.dims.value);
        const nodes:any = this.nodes || [];
        nodes.names = nodes.names || {};
        const links:any = this.links || [];
        links.myKeys = links.myKeys || {};
        data.rows.forEach((r:number[]|string[]) => { 
            for (let i=1; i<keys.length; i++) {
                const s = keys[i-1];
                const d = keys[i];
                if (!nodes.names[r[s]]) { nodes.push(nodes.names[r[s]] = { name: r[s]})}
                if (!nodes.names[r[d]]) { nodes.push(nodes.names[r[d]] = { name: r[d]})}
                const key = `${r[s]}-${r[d]}`;
                if (!links.myKeys[key]) {
                    links.push(links.myKeys[key] = {
                        source: r[s],
                        target: r[d],
                        names:  [r[s], r[d]],
                        value: 0
                    });
                }
                links.myKeys[key].value += r[v];
            }
        });
        return {
            nodes: nodes,
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
        const popup = this.cfg.components.popup;
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
                .attr('fill-opacity', 0)
                .selectAll("g")
                .data(this.links)
                .join("path")
                    .style("mix-blend-mode", "multiply")
                    .attr("d", sankeyLinkHorizontal())
                    .attr("stroke", d => defaults.line.color)
                    .attr("stroke-width", d => Math.max(1, d.width))
                    .call(this.d3FillColors.bind(this), data, defaults)
                    .append("title")
                    .text((d:any) => `${d.source.name} → ${d.target.name}:${d.value}`);
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
    }

    /**
     * formats the popup string to display
     * @param colNames 
     */
    protected d3RenderPopup(data:DataSet):AccessFn {
        return (r:any) => r.name || '???';
    }
}
  

/*


M149,328
C209,328,209,275,268,275

M536,204
C774,204,774,291,1012,291
*/