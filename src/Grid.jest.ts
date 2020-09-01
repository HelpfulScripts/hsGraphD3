import * as hsGraphD3   from './';
import * as d3          from 'd3';
import { DataSet }      from './Graph';

let clientWidth = 300;

d3.selection.prototype.transition   = function(){ return this; };
d3.selection.prototype.duration     = function(){ return this; };
d3.selection.prototype.ease         = function(){ return this; };

const data:DataSet = {
    colNames: 
        ['xval', 'yval', 'rval'],
    rows : [
        [-1,      15,     15],
        [0.2,      2,     23],
        [3,       28,     30],
        [7.5,     13,      8]
    ]
};

function createGraph(root:any) {
    const graph = new hsGraphD3.Graph(root);
    graph.isRendered = () => true;
    graph.axes.defaults.hor.numTicksMinor = 10;
    graph.axes.defaults.hor.numTicksMajor = 2;
    graph.axes.defaults.ver.numTicksMinor = 10;
    graph.axes.defaults.ver.numTicksMajor = 2;
    graph.add('line', {x:'xval', y:'yval', r:'rval'});
    return graph;
}

describe('Grid', () => {
    describe('plot all', () => {
        const root = window.document.createElement("div");
        root.style.width = `${clientWidth}px`;
        root.style.height = "300px";
        let graph:hsGraphD3.Graph;
        beforeEach(() => graph = createGraph(root));
        it('should plot grid', () => {
            graph.render(data);
            return expect(d3.select(root).selectAll('.grids')['_groups'][0][0]).toMatchSnapshot();
        });
    });
    describe('plot horizontal', () => {
        const root = window.document.createElement("div");
        root.style.width = `${clientWidth}px`;
        root.style.height = "300px";
        let graph:hsGraphD3.Graph;
        beforeEach(() => graph = createGraph(root));
        it('should not plot vertical grid', () => {
            graph.grids.defaults.ver.major.rendered = false;
            graph.grids.defaults.ver.minor.rendered = false;
            graph.render(data);
            return expect(d3.select(root).selectAll('.grids')['_groups'][0][0]).toMatchSnapshot();
        });
    });
});
