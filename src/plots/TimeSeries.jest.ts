import * as hsGraphD3   from '../';
import * as d3 from 'd3';
import { DataSet }      from '../Graph';
import { SeriesPlotDefaults } from '../SeriesPlot';
import { AxesDefaults } from '../Axis';

let clientWidth = 300;
const root = window.document.createElement("div");
root.style.width = `${clientWidth}px`;
root.style.height = "300px";

d3.selection.prototype.transition   = function(){ return this; };
d3.selection.prototype.duration     = function(){ return this; };
d3.selection.prototype.ease         = function(){ return this; };

const data:DataSet = {
    colNames: 
        ['time', 'yval'],
    rows : [
        [new Date('1/1/20'),      15,     15],
        [new Date('3/1/20'),      2,     23],
        [new Date('6/1/20'),       28,     30],
        [new Date('9/1/20'),     13,      8]
    ]
};

function createGraph(root:any) {
    const graph = new hsGraphD3.Graph(root);
    graph.isRendered = () => true;
    graph.axes.defaults.hor.numTicksMinor = 10;
    graph.axes.defaults.hor.numTicksMajor = 2;
    graph.axes.defaults.ver.numTicksMinor = 10;
    graph.axes.defaults.ver.numTicksMajor = 2;
    return graph;
}


describe('TimeSeries', () => {
    let graph:hsGraphD3.Graph;
    beforeAll(() => {
        graph = createGraph(root);
        graph.add('timeseries', {x:'time', y:'yval'});
        graph.series.defaults['series0'].marker.rendered = true;
        graph.series.defaults['series0'].area.rendered = true;
        graph.render(data);
    });
    it('should plot timeSeries', () =>
        expect(root).toMatchSnapshot()
    );
    it('should support settings changes', () => {
        graph.axes.defaults.color = '#666';
        expect(graph.axes.defaults.color).toBe('#666');
    });
    it(`should have 'timeseries' registered`, () =>
        expect(graph.seriesTypes).toContain('timeseries')
    );
});
