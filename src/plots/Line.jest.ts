import * as hsGraphD3   from '../';
import { log }          from 'hsnode';
import * as d3 from 'd3';
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


describe('Line', () => {
    let graph:hsGraphD3.GraphCartesian;

    describe('plot data', () => {
        beforeAll(() => {
            graph = createGraph(root);
            graph.addSeries('line', {x:'xval', y:'yval', r:'rval'});
            graph.defaults.axes.color = '#666';
            graph.render(data);
        });
        it(`should have 'line' registered`, () =>
            expect(graph.seriesTypes).toContain('line')
        );
        it('should support settings changes', () => {
            expect(graph.defaults.axes.color).toBe('#666');
        });
        it('should plot line', () =>
            expect(root).toMatchSnapshot()
        );
    });

    describe('plot constants', () => {
        beforeEach(() => {
            graph = createGraph(root);
            graph.addSeries('line', {x:'xval', y:()=>10});
            graph.render(data);
        });
        it('should plot horizontal line', () => {
            expect(root).toMatchSnapshot();
        });
    });
});
