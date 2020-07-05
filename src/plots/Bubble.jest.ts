import * as hsGraphD3   from '../';
import { Log }          from 'hsnode';
import * as d3 from 'd3';
import { DataSet }      from '../Graph';
import { TextHAlign, TextVAlign } from '../Settings';

const root = window.document.createElement("div");
root.style.width = "300px";
root.style.height = "300px";

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
    return graph;
}

describe('Bubble', () => {
    let graph:hsGraphD3.Graph;
    beforeAll(() => {
        graph = createGraph(root);
        graph.add('bubble', {x:'xval', y:'yval', r:'rval', label:5});
        graph.add('bubble', {x:'xval', y:'yval', r:'rval', label:5});
        graph.defaults.series[1].label.xpos = TextHAlign.right;
        graph.add('bubble', {x:'xval', y:'yval', r:'rval', label:5});
        graph.defaults.series[2].label.xpos = TextHAlign.left;
        graph.add('bubble', {x:'xval', y:'yval', r:'rval', label:5});
        graph.defaults.series[3].label.ypos = TextVAlign.bottom;
        graph.add('bubble', {x:'xval', y:'yval', r:'rval', label:5});
        graph.defaults.series[4].label.ypos = TextVAlign.top;
        graph.render(data);
    });
    it('should plot series', () =>
        expect(root).toMatchSnapshot()
    );
});
