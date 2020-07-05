import * as hsGraphD3   from '../';
import * as d3          from 'd3';
import { SankeyDefaults } from './Sankey';

let clientWidth = 300;
const root = window.document.createElement("div");
root.style.width = `${clientWidth}px`;
root.style.height = "300px";

d3.selection.prototype.transition   = function(){ return this; };
d3.selection.prototype.duration     = function(){ return this; };
d3.selection.prototype.ease         = function(){ return this; };

const data = {
    colNames:['from', 'via', 'to', 'count'], 
    rows:[['a', 'sheep', 'one', 45], ['b', 'wolf', 'one', 15], ['c', 'sheep', 'two', 22],
          ['c', 'sheep', 'one', 40], ['c', 'wolf', 'three', 23], ['a', 'fence', 'three', 5]
    ]
};
   
function createGraph(root:any) {
    const graph = new hsGraphD3.Graph(root);
    graph.isRendered = () => true;
    return graph;
}


describe('Sankey', () => {
    let graph:hsGraphD3.Graph;
    beforeAll(() => {
        graph = createGraph(root);
        graph.add('sankey', {keys:['from', 'via', 'to'], value:'count', color:'cat10'});
        (<SankeyDefaults>graph.defaults.series.series0).align = 'left';
        graph.render(data);
    });
    it('should plot sankey', () => expect(root).toMatchSnapshot());
});
