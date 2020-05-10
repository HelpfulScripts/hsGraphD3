

import { SeriesPlot, ValueDef, SeriesPlotDefaults } from "./SeriesPlot";
import { DataSet, OrdDomain, DataRow, DataVal, NumDomain, GraphDimensions, Domains, AccessFn } from "./Graph";
import { d3Base } from "./Settings";


export abstract class SeriesPlotScaled extends SeriesPlot { 
    /** the main data line  */
    protected line: string;         // d3Line<number[]>;

    /**
     * Returns an accessor function to access the numeric value in a data row. 
     * @param dim the semantic dimension ('hor', 'ver', 'size') in which to aggregate
     * @param v data column value definition
     * @param colNames 
     */
    accessor(v:ValueDef, colNames:string[], useStack=true):AccessFn {
        if (useStack && this.dims.stacked) {
            // stackDim = is 'v' a stackable dimension?
            const stackDim = this.getStackDim(v);
            const abscissaCol = this.getAbscissaCol();
            if (stackDim && typeof abscissaCol === 'string') {
                const stackIndex = colNames.indexOf(this.dims.stacked);
                const fn = super.accessor(v, colNames);
                return (row, rowIndex) => <number>row[stackIndex] + <number>fn(row, rowIndex);
            }
        }
        return super.accessor(v, colNames);
    }

    abstract getStackDim(v:ValueDef):boolean;
    abstract getAbscissaCol(): ValueDef;
    abstract getOrdinateCol(): ValueDef;



    public expandDomains(dataSet:DataSet, domains:Domains) {
        this.updateStack(dataSet);
        const dims:GraphDimensions = this.dimensions;
        Object.keys(dims).map(dim => { // dim='hor', 'ver', size'
            const useStack = dim!=='size';  // donst stack-scale marker sizes

            const type = this.cfg.graph.defaults.scales.dims[dim].type;
            dims[dim].map(colName => { if (colName!==undefined) { 
                const valueFn = this.accessor(colName, dataSet.colNames, useStack);
                switch(type) {
                    case 'ordinal':     
                        domains[dim] = this.expandOrdinalDomain(dataSet, <OrdDomain>domains[dim] || [], valueFn); 
                        break;
                    default:            
                        domains[dim] = this.expandNumDomain(dataSet, <NumDomain>domains[dim] || [1e99, -1e99], valueFn);
                }
            }});
        });
    }
    
    protected expandNumDomain(dataSet:DataSet, domain:NumDomain, fn:(row?:DataRow, i?:number) => DataVal):NumDomain {
        return <NumDomain>dataSet.rows.reduce((dom:NumDomain, row:DataRow, i:number):NumDomain => {
            const val = <number>fn(row, i);
            dom[0] = Math.min(val, dom[0]);
            dom[1] = Math.max(val, dom[1]);
            return dom;
        }, domain);
    }
    
    protected expandOrdinalDomain(dataSet:DataSet, domain:OrdDomain, fn:(row?:DataRow, i?:number) => DataVal):OrdDomain {
        return <OrdDomain>dataSet.rows.reduce((dom:OrdDomain, row:DataRow, i:number):OrdDomain => {
            const val = <string>fn(row, i);
            if (dom.indexOf(val) < 0) { dom.push(val); }
            return dom;
        }, domain);
    }

    //---------- lifercycle methods --------------------
    public preRender(data:DataSet): void {
        super.preRender(data);
        this.clearStack(data);
        this.line = undefined;
    }

    /** renders the component for the given data */
    public renderComponent(data:DataSet): void {
        data = { colNames: data.colNames, rows: data.rows.slice() };
        this.updateStack(data);
        super.renderComponent(data);
    }

    public postRender(data:DataSet): void {
        super.postRender(data);
    }
        
    //---------- support methods during lifecylce --------------------

    protected abstract d3RenderMarkers(svg:d3Base, data:DataSet):void;

    protected abstract markerShape():string;

    protected abstract d3RenderLine(svg:d3Base, data:DataSet):void;

    protected abstract d3RenderLabels(labels:d3Base, data:DataSet):void;

    protected abstract d3DrawMarker(markers:d3Base, data:DataSet, defaults:SeriesPlotDefaults):void;

    protected abstract d3DrawLabels(labels:d3Base, data:DataSet, defaults:SeriesPlotDefaults):void;

    protected getPathElement(svg:d3Base, cls:string):any {
        return svg.select(cls).selectAll('path').transition(this.cfg.transition);
    }

    protected abstract getPath(rows:DataRow[], colNames:string[], yDef?: ValueDef, useStack?:boolean):string;


    //---------- stack methods --------------------

    /** clears the stack for this cycle before any series rendering happens. */
    public clearStack(data:DataSet) {
        const group = this.dims.stacked;
        if (group) {
            if (data.colNames.indexOf(group) < 0) { 
                data.colNames.push(group); 
            }
            const stackCol = data.colNames.indexOf(group);
            data.rows.forEach(row => row[stackCol] = 0);
            this.cfg.stack[this.dims.stacked] = {};
        }
    }
    
    /** update stack after rendering series. */
    protected updateStack(data:DataSet) {
        const group = this.dims.stacked;
        if (group) {
            const stack = this.cfg.stack[group];
            const stackCol = data.colNames.indexOf(group);
            const abscissaCol = <string>this.getAbscissaCol();
            const abscissaIndex = data.colNames.indexOf(abscissaCol);
            const ordinateCol = <string>this.getOrdinateCol();
            const ordinateIndex = data.colNames.indexOf(ordinateCol);
            data.rows.forEach(row => {
                const abscissaKey = ''+row[abscissaIndex];
                row[stackCol] = <number>stack[''+abscissaKey] || 0;
                stack[''+abscissaKey] = (stack[''+abscissaKey]||0) + <number>row[ordinateIndex];
            });
        }
    }
}
