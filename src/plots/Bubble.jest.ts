import * as hsGraphD3   from '../';
import { log }          from 'hsnode';
import * as d3 from 'd3';
import { DataSet }      from '../Graph';

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

describe('Bubble', () => {
    let graph:hsGraphD3.GraphCartesian;
    beforeAll(() => {
        graph = new hsGraphD3.GraphCartesian(root);
        graph.addSeries('bubble', 'xval', 'yval', 'rval');
        graph.render(data);
    });
    it('should plot line', () =>
        expect(root).toMatchSnapshot()
    );
});