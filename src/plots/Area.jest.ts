import * as hsGraphD3   from '../';
import * as d3          from 'd3';
import { DataSet }      from '../Graph';
import { AxesDefaults } from '../Axis';

let clientWidth = 300;
const root = window.document.createElement("div");
root.style.width = `${clientWidth}px`;
root.style.height = "300px";

d3.selection.prototype.transition   = function(){ return this; };
d3.selection.prototype.duration     = function(){ return this; };
d3.selection.prototype.ease         = function(){ return this; };

const data:DataSet = {
    colNames:['time', 'volume', 'costs'], 
    rows:[    [-1,    0.2,      0.3], 
              [0.2,   0.7,      0.2], 
              [0.4,   0.1,      0.3],
              [0.6,  -0.2,      0.1], 
              [0.8,   0.3,      0.5], 
              [1,     0.2,      0.4]
    ]
};

function createGraph(root:any) {
    const graph = new hsGraphD3.GraphCartesian(root);
    graph.isRendered = () => true;
    graph.axes.defaults.hor.numTicksMinor = 10;
    graph.axes.defaults.hor.numTicksMajor = 2;
    graph.axes.defaults.ver.numTicksMinor = 10;
    graph.axes.defaults.ver.numTicksMajor = 2;
    return graph;
}

describe('Area', () => {
    let graph:hsGraphD3.GraphCartesian;
    beforeAll(() => {
        graph = createGraph(root);
        graph.series.add('area', {x:'time', y:'volume'});
        graph.render(data);
    });
    it(`should have 'area' registered`, () =>
        expect(graph.seriesTypes).toContain('area')
    );
    it('should plot area', () =>
        expect(root).toMatchSnapshot()
    );
    it('should support settings changes', () => {
        graph.axes.defaults.color = '#666';
        expect(graph.axes.defaults.color).toBe('#666');
    });
});
