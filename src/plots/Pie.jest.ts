import * as hsGraphD3   from '../';
import * as d3          from 'd3';
import { DataSet }      from '../Graph';

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
    const graph = new hsGraphD3.Graph(root);
    graph.isRendered = () => true;
    return graph;
}


describe('Pie labels', () => {
    let graph:hsGraphD3.Graph;
    beforeAll(() => {
        graph = createGraph(root);
        graph.add('pie', {phi:'costs', label:(row, i)=>i});
        graph.add('pie', {phi:'costs', label:(row, i)=>i});
        graph.defaults.series[0].label.xpos = 0.5;
        graph.title.text = `Pie Graph`;
        graph.render(data);
    });
    it('should plot pie', () => expect(root).toMatchSnapshot());
});

describe('Pie colors', () => {
    let graph:hsGraphD3.Graph;
    beforeAll(() => {
        graph = createGraph(root);
        graph.add('pie', {phi:'costs', r0: 5, color:'time'});
        graph.render(data);
    });
    it('should plot pie', () => expect(root).toMatchSnapshot());
});
