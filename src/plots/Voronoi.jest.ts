import * as hsGraphD3       from '../';
import * as d3              from 'd3';
import { Graph, DataSet }   from '../Graph';
import { Log }              from 'hsnode'; const log = new Log('Voronoi.jest');
import { Voronoi }          from './Voronoi';


let clientWidth = 300;
const root = window.document.createElement("div");
root.style.width = `${clientWidth}px`;
root.style.height = "300px";

d3.selection.prototype.duration     = function(){ return this; };
d3.selection.prototype.ease         = function(){ return this; };
d3.selection.prototype.transition   = function(){ return this; };

// const on = d3.selection.prototype.on;
// d3.selection.prototype.on           = function(event:string, cb:any) { 
//     // if (event === 'end') {
//     //     setTimeout(cb, 100); 
//     //     return this;
//     // } 
//     return on(event, cb);
// };

let graph:Graph;

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

function createGraph(root:any) {
    const graph = new hsGraphD3.Graph(root);
    graph.isRendered = () => true;
    graph.axes.defaults.hor.numTicksMinor = 10;
    graph.axes.defaults.hor.numTicksMajor = 2;
    graph.axes.defaults.ver.numTicksMinor = 10;
    graph.axes.defaults.ver.numTicksMajor = 2;
    return graph;
}

describe('Voronoi', () => {
    beforeAll(() => {
        graph = createGraph(root);
        graph.add('voronoi', {x:'xval', y:'yval'});
        graph.render(data);
    });

    it('should plot voronoi diagram', () => 
        expect(root).toMatchSnapshot()
    );

    it('should get centroids', () => {
        const samples = [[0,1], [2,3]];
        const c = Voronoi.centroid(samples);
        expect(c.join(', ')).toBe([1, 2].join(', '));
    });

    it('should get nearest', () => {
        const sample = [0,1];
        const anchors = [[0,1], [2,3]];
        const best = Voronoi.nearest(sample, anchors);
        expect(best).toBe(0);
    });
});
