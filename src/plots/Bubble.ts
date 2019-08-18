/**
 * # Bubble Plot
 * 
 * ## Example
 * <example height=200px libs={hsGraphD3:'hsGraphD3'}>
 * <file name='script.js'>
 * // create data set:
 * const data = {
 *    colNames:['date', 'time', 'volume', 'costs'], 
 *    rows:[['1/1/14', -1,  0.2, 0.3], ['1/1/16', 0.2, 0.7, 0.2], ['9/1/16', 0.4, 0.1, 0.3],
 *          ['5/1/17', 0.6, -0.2,   0.1], ['7/1/18', 0.8, 0.3, 0.5], ['1/1/19', 1,   0.2, 0.4]]
 * };
 * 
 * // setup and plot the data:
 * const graph = new hsGraphD3.GraphCartesian(root);
 * graph.addSeries('bubble', 'time', 'volume', 'costs');
 * graph.render(data);
 * 
 * </file>
 * </example>
 */

 /** */

import { log as gLog }          from 'hsutil';   const log = gLog('Bubble');
import { Data }                 from 'hsdatab';
import { SeriesPlot }           from '../SeriesPlot';
import { SeriesPlotDefaults }   from '../SeriesPlot';
import { Series }               from '../Series';
import { d3Base }               from '../Settings';
import { GraphCfg }             from '../GraphComponent'; 


class Bubble extends SeriesPlot {
    /**
     * plot constructor
     * @param cx string column name for x-center coordinates
     * @param cy string column name for y-center coordinates
     * @param r  string column name for radius coordinates
     */
    constructor(cfg:GraphCfg, seriesName:string, protected cx:string, protected cy:string, protected r?:string) {
        super(cfg, seriesName, cx, cy, r);
    }

    getDefaults(): SeriesPlotDefaults {
        const def = super.getDefaults();
        return def;
    }
    
    /**
     * 
     * @param data a {@link hsDatab:Data `Data`} object containing the 
     */
    renderComponent(data:Data) {  
        this.renderMarkers(data);
    }
} 

//Plot.register('bubble', new BubbleFatory());
Series.register('bubble', (cfg:GraphCfg, sName:string, cx:string, cy:string, r?:string) => new Bubble(cfg, sName, cx, cy, r));
