import * as hsGraphD3   from '../';
import * as d3 from 'd3';
import { DataSet }      from '../Graph';
import { SeriesPlotDefaults } from '../SeriesPlot';

let clientWidth = 300;
const root = window.document.createElement("div");
root.style.width = `${clientWidth}px`;
root.style.height = "300px";

d3.selection.prototype.transition   = function(){ return this; };
d3.selection.prototype.duration     = function(){ return this; };
d3.selection.prototype.ease         = function(){ return this; };

const data:DataSet = {
    colNames: 
        ['xval', 'yval'],
    rows : [
        [-1,      15,     15],
        [0.2,      2,     23],
        [3,       28,     30],
        [7.5,     13,      8]
    ]
};

describe('TimeSeries', () => {
    let graph:hsGraphD3.GraphCartesian;
    beforeAll(() => {
        graph = new hsGraphD3.GraphCartesian(root);
        graph.addSeries('timeseries', {x:'xval', y:'yval'});
        (<SeriesPlotDefaults>graph.defaults.series.series0).marker.rendered = true;
        (<SeriesPlotDefaults>graph.defaults.series.series0).area.rendered = true;
        graph.render(data);
    });
    it('should plot timeSeries', () =>
        expect(root).toMatchSnapshot()
    );
    it('should support settings changes', () => {
        graph.defaults.axes.color = '#666';
        expect(graph.defaults.axes.color).toBe('#666');
    });
    it(`should have 'timeseries' registered`, () =>
        expect(graph.seriesTypes).toContain('timeseries')
    );
});
