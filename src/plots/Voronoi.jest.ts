import * as hsGraphD3   from '../';
import * as d3 from 'd3';
import { DataSet }      from '../Graph';

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
        [-1,      15],
        [0.2,      2],
        [3,       28],
        [7.5,     13]
    ]
};

describe('Voronoi', () => {
    let graph:hsGraphD3.GraphCartesian;
    beforeAll(() => {
        graph = new hsGraphD3.GraphCartesian(root);
        graph.addSeries('voronoi', {x:'xval', y:'yval'});
        graph.render(data);
    });
    it('should plot voronoi diagram', () =>
        expect(root).toMatchSnapshot()
    );
});
