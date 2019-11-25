import * as hsGraphD3   from '../';
import { log }          from 'hsnode';
import * as d3 from 'd3';
import { DataSet }      from '../Graph';
import { AxesDefaults } from '../Axis';

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
    const graph = new hsGraphD3.GraphCartesian(root);
    graph.isRendered = () => true;
    (<AxesDefaults>graph.defaults.axes).hor.numTicksMinor = 10;
    (<AxesDefaults>graph.defaults.axes).hor.numTicksMajor = 2;
    (<AxesDefaults>graph.defaults.axes).ver.numTicksMinor = 10;
    (<AxesDefaults>graph.defaults.axes).ver.numTicksMajor = 2;
    return graph;
}

describe('Bubble', () => {
    let graph:hsGraphD3.GraphCartesian;
    beforeAll(() => {
        graph = createGraph(root);
        graph.addSeries('bubble', {x:'xval', y:'yval', r:'rval'});
        graph.render(data);
    });
    it('should plot series', () =>
        expect(root).toMatchSnapshot()
    );
});
