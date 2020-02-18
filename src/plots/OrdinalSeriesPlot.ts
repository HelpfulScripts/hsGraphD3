/**
 * # OrdinalSeriesPlot
 * 
 * Abstract base class for all ordinal series plot types.
 * To create a series plot, add the desired plot type to the graph:
 * ```
 * graph.series.add(<type>, {<dim>: <ValueDef>, ...});
 * ``` 
 * - `<type>` is one of the registered types: 
 *     - &nbsp; {@link plots.Bar `bar`} a horizontal bar chart
 *     - &nbsp; {@link plots.Column `column`} a vertical column chart
 * - `<dim>` is one of the semantic dimensions defined for the plot. `NumericSeriesPlots` define the 
 *   following dimensions:
 *     - `x`: required; the value to plot along the x-axis
 *     - `y`: required; the value to plot along the y-axis
 *     - `label`: optional; the value to use for labels
 *     - `color`: optional {@link SeriesPlot.d3MarkerColors color value} to apply to markers
 *     - `stacked`: optional, specifies a group name for which series values will be stacked.
 * - `<ValueDef>` is the {@link SeriesPlot.ValueDef value definition} to use for the {@link Series.SeriesDimensions semantic dimension}. Values may be specified
 *     - by `string` to specify the column name of the data set to use
 *     - by `number` to specify a constant value to use.  
 */

/** */
import { Log }                  from 'hsutil'; const log = new Log('OrdinalSeriesPlot');
import { DataRow }              from '../Graph';
import { DataVal }              from '../Graph';
import { NumDomain }            from '../Graph';
import { DataSet }              from '../Graph';
import { Domains }              from '../Graph';
import { d3Base }               from '../Settings';
import { Label }                from '../Settings';
import { CartSeriesPlot, text } from '../CartSeriesPlot';
import { SeriesPlotDefaults }   from '../SeriesPlot';
import { Series }               from '../Series';
import { TextHAlign }           from "../Settings";
import { TextVAlign }           from "../Settings";

/**
 * Abstract base class of a  cartesian series plot. 
 */
export abstract class OrdinalSeriesPlot extends CartSeriesPlot { 
    /** used  */
    protected cache = { x:<number[]>[], x0:<number[]>[], y:<number[]>[], y0:<number[]>[] };

    getDefaults(): SeriesPlotDefaults {
        const scaleDef = this.cfg.graph.defaults.scales.dims[this.abscissa];
        scaleDef.type = 'ordinal';
        scaleDef.ordinal = scaleDef.ordinal || { gap:0.3, overlap:0};

        const def = super.getDefaults();
        def.area.rendered = false;
        def.marker.rendered = true;
        def.line.rendered = false;
        def.line.width = 1;
        return def;
    } 

    /** ensures that 0 is in the domain, since the columns extend down to 0. */
    protected expandNumDomain(dataSet:DataSet, domain:NumDomain, fn:(row?:DataRow, i?:number) => DataVal):NumDomain {
        domain = super.expandNumDomain(dataSet, domain, fn);
        domain[0] = Math.min(0, domain[0]);
        domain[1] = Math.max(0, domain[1]);
        return domain;
    }

    //---------- lifecylce methods --------------------

    initialize(svg:d3Base, color?:string): void {
        super.initialize(svg, color);
    }

    preRender(data:DataSet, domains:Domains): void {
        super.preRender(data, domains);
        const scaleDef = this.cfg.graph.defaults.scales.dims[this.abscissa];
        const gap = scaleDef.ordinal.gap;
        const scale = this.cfg.graph.scales.scaleDims[this.abscissa];
        scale.paddingInner(gap);
        scale.paddingOuter(gap/2);
        this.cache = { x:<number[]>[], x0:<number[]>[], y:<number[]>[], y0:<number[]>[] };
    }
 

    //---------- support methods during lifecylce --------------------

    protected markerShape() { return 'rect'; }

    protected d3RenderPath(svg:d3Base, data:DataSet) {
        const line = this.getLine(data.rows, data.colNames);
        return this.getPathElement(svg, '.line').attr('d', (d:any) => line);
    }

    protected d3RenderFill(svg:d3Base, data:DataSet) {
    }
    
    private getParams(colNames:string[]):any[] {
        const scales = this.cfg.graph.scales;
        const scaleDef = scales.defaults.dims[this.abscissa];
        const stackGroup = this.dims.stacked || false;
        const allKeys = Object.keys(this.cfg.graph.series.defaults).filter(k => k.indexOf(Series.type)===0);
        const myKey = allKeys.indexOf(this.key) || 0;
        const step = scales.scaleDims[this.abscissa].step();
        const pad = scales.scaleDims[this.abscissa].paddingInner();
        const overlap = scaleDef.ordinal.overlap;
        const thickness = step * (1-pad) / (stackGroup? 1 : (allKeys.length * (1-overlap) + overlap));
        const offset = step*pad/2 + (stackGroup? 0 : thickness*myKey * (1-overlap));
        return [offset, thickness];
    }

    /**
     * returns a function that provides the stack base value for the given column Index
     * @param row the data row to consider
     */
    // protected getStackVal(row: number[])

    protected d3DrawMarker(markers:d3Base, colNames:string[]) {
        const [offset, thickness] = this.getParams(colNames);

        const xScale = this.cfg.graph.scales.scaleDims.hor;
        const yScale = this.cfg.graph.scales.scaleDims.ver;
        const x  = this.accessor(this.dims.x, colNames);
        const x0 = this.dims.stacked? this.accessor(this.dims.stacked, colNames) : ()=>0;
        const y  = this.accessor(this.dims.y, colNames);
        const y0 = this.dims.stacked? this.accessor(this.dims.stacked, colNames) : ()=>0;
        const xAttr  = (d:number[], i:number) => this.cached('x', i, ()=>xScale(x(d, i)));
        const x0Attr = (d:number[], i:number) => this.cached('x0',i, ()=>xScale(x0(d, i)));
        const yAttr  = (d:number[], i:number) => this.cached('y', i, ()=>yScale(y(d, i)));
        const y0Attr = (d:number[], i:number) => this.cached('y0',i, ()=>yScale(y0(d, i)));

        if (this.abscissa==='hor') { // Column
            markers
                .attr("x",  (d:number[], i:number) => xAttr(d,i) + offset)
                .attr("y",  (d:number[], i:number) => Math.min(yAttr(d,i), y0Attr(d,i)))
                .attr("width",  () => thickness)
                .attr("height", (d:number[], i:number) => Math.abs(yAttr(d,i)-y0Attr(d,i)));        
        } else {                    // Bar
            markers
                .attr("x",  (d:number[], i:number) => Math.min(xAttr(d,i), x0Attr(d,i)))
                .attr("y",  (d:number[], i:number) => yAttr(d,i) + offset)
                .attr("height", () => thickness)
                .attr("width",  (d:number[], i:number) => Math.abs(x0Attr(d,i)-xAttr(d,i)));
        }
    }


    cached(v:string, i:number, get:()=>number) {
        return this.cache[v][i]===undefined? this.cache[v][i]=get() : this.cache[v][i];
    }

    protected d3DrawLabels(labels:d3Base, colNames:string[]) {
        const [offset, thickness] = this.getParams(colNames);

        const xScale = this.cfg.graph.scales.scaleDims.hor;
        const yScale = this.cfg.graph.scales.scaleDims.ver;
        
        const l = this.accessor(this.dims.label, colNames);
        const cfg:Label = this.defaults.label;

        const [xpos, ypos] = this.labelPos(cfg, labels);
        const x  = this.accessor(this.dims.x, colNames);
        const x0 = this.dims.stacked? this.accessor(this.dims.stacked, colNames) : ()=>0;
        const y  = this.accessor(this.dims.y, colNames);
        const y0 = this.dims.stacked? this.accessor(this.dims.stacked, colNames) : ()=>0;
        const xAttr  = (d:number[], i:number) => this.cached('x', i, ()=>xScale(x(d, i)));
        const x0Attr = (d:number[], i:number) => this.cached('x0', i, ()=>xScale(x0(d, i)));
        const yAttr  = (d:number[], i:number) => this.cached('y', i, ()=>yScale(y(d, i)));
        const y0Attr = (d:number[], i:number) => this.cached('y0', i, ()=>yScale(y0(d, i)));
        if (this.abscissa==='hor') {    // Column
            labels
                .attr("x",  (d:number[], i:number) => xAttr(d, i) + offset + thickness*xpos)
                .attr("y",  (d:number[], i:number) => 
                    Math.min(yAttr(d,i), y0Attr(d,i)) + Math.abs(yAttr(d,i) -y0Attr(d,i)) * ypos
                );
        } else {                        // Bar
            labels
                .attr("y",  (d:number[], i:number) => yAttr(d,i) + offset + thickness* ypos)
                .attr("x",  (d:number[], i:number) => 
                    Math.min(xAttr(d, i),x0Attr(d, i)) + Math.abs(xAttr(d, i)-x0Attr(d, i))* xpos
                );
        }
        labels.text((d:number[], i:number) => text(l(d, i)));
    }

    protected getLine(rows:DataRow[], colNames:string[]):string {
        const hor = this.abscissa==='hor';
        const x  = this.accessor(this.dims.x, colNames);
        const y  = this.accessor(this.dims.y, colNames);
        const [offset, thickness] = this.getParams(colNames);

        const xScale = this.cfg.graph.scales.scaleDims.hor;
        const yScale = this.cfg.graph.scales.scaleDims.ver;
        const xAttr  = (d:number[], i:number) => this.cached('x', i, ()=>xScale(x(d, i)));
        const yAttr  = (d:number[], i:number) => this.cached('y', i, ()=>yScale(y(d, i)));

        const line = hor?
            stepLine(parseInt(''+thickness), 'hor')
                .x((d:number[], i:number) => xAttr(d,i)+offset)
                .y((d:number[], i:number) => yAttr(d,i))
          : stepLine(parseInt(''+thickness), 'ver')
                .x((d:number[], i:number) => xAttr(d,i))
                .y((d:number[], i:number) => yAttr(d,i)+offset);
        return line(rows);
    }

    protected labelPos(cfg:Label, labels:d3Base) {
        let xShift = 0;
        let yShift = 0.35;
        let xpos = 0.5; // 0: left aligned, 1: right aligned
        let ypos = 0.5;   // 0: top of bar, 1: bottom of bar
        let anchor = 'middle';
        switch(cfg.xpos) { 
            case TextHAlign.left:   xpos = 0; xShift = cfg.inside?0.2:-0.2; anchor = cfg.inside?'start':'end'; break;
            case TextHAlign.center: break;
            case TextHAlign.right:  xpos = 1; xShift = cfg.inside?-0.2:0.2; anchor = cfg.inside?'end':'start';  break;
            default: log.warn(`illegal TextHAlign: ${cfg.xpos}`);
        }
        switch(cfg.ypos) { // additional y 'em' shift
            case TextVAlign.top:    ypos = 0; yShift = cfg.inside? 1 : -0.2; break;
            case TextVAlign.center: break;
            case TextVAlign.bottom: ypos = 1; yShift = cfg.inside? -0.2 : 1; break;
            default:  log.warn(`illegal TextVAlign: ${cfg.ypos}`);
        }
        labels.style('text-anchor', anchor)
              .attr('dx', ((cfg.hOffset||0)+xShift).toFixed(1) + 'em')
              .attr('dy', ((cfg.vOffset||0)+yShift).toFixed(1) + 'em');
    return [xpos, ypos];
    }
}


function stepLine(step:number, axis:'hor'|'ver') {
    interface Accessor { (d:DataVal[], i:number): number; }
    let xAccess:Accessor;
    let yAccess:Accessor;
    const accessors = (rows: DataRow[]):string => {
        const result = rows.map((r, i) => {
            const x = parseInt(''+xAccess(r, i));
            const y = parseInt(''+yAccess(r, i));
            return (i===0?'M':'L') + x + ' ' + 
                ((axis==='hor')? (y + 'L' + (x+step)) : ((y+step) + 'L' + x ))
                + ' ' + y;
        }).join('');
        return result;
    };
    accessors.x = (fn:Accessor) => {
        xAccess = fn;
        return accessors;
    };
    accessors.y = (fn:Accessor) => {
        yAccess = fn;
        return accessors;
    };
    return accessors;
}

