import * as hsGraphD3           from '../';
import * as d3                  from 'd3';
import { DataSet }              from '../Graph';

let clientWidth = 300;
const root = window.document.createElement("div");
root.style.width = `${clientWidth}px`;
root.style.height = "300px";

d3.selection.prototype.transition   = function(){ return this; };
d3.selection.prototype.duration     = function(){ return this; };
d3.selection.prototype.ease         = function(){ return this; };

const data:DataSet = {
    colNames: ['State', 'volume', 'costs'], 
    rows:[    ['CA',     -1,       0.2], 
              ['MA',      0.2,     0.7], 
              ['FL',      0.4,     0.1],
              ['SC',      0.6,    -0.2], 
              ['NV',      0.8,     0.3], 
              ['NC',      1,       0.2]]
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

describe('Bar', () => {
    let graph:hsGraphD3.Graph;
    beforeAll(() => {
        graph = createGraph(root);
        graph.add('bar', {x:'costs', y:'State', stacked:'grp'});
        graph.add('bar', {x:'volume', y:'State', stacked:'grp'});
        graph.series.defaults['series0'].line.rendered = true;
        graph.render(data);
    });
    it(`should have 'bar' registered`, () =>
        expect(graph.seriesTypes).toContain('bar')
    );
    it('should plot bar', () =>
        expect(root).toMatchSnapshot()
    );
    it('should support settings changes', () => {
        graph.axes.defaults.color = '#666';
        expect(graph.axes.defaults.color).toBe('#666');
    });
});
