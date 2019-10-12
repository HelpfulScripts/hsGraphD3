import * as hsGraphD3   from '../';
import { log }          from 'hsnode';
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
        ['xval', 'yval', 'rval'],
    rows : [
        [-1,      15,     15],
        [0.2,      2,     23],
        [3,       28,     30],
        [7.5,     13,      8]
    ]
};

describe('Line', () => {
    let graph:hsGraphD3.GraphCartesian;

    describe('plot data', () => {
        beforeAll(() => {
            graph = new hsGraphD3.GraphCartesian(root);
            graph.addSeries('line', {x:'xval', y:'yval', r:'rval'});
            graph.defaults.axes.color = '#666';
            graph.render(data);
        });
        it(`should have 'line' registered`, () =>
            expect(graph.series.types).toContain('line')
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
            graph = new hsGraphD3.GraphCartesian(root);
            graph.addSeries('line', {x:'xval', y:10});
            graph.render(data);
        });
        it('should plot horizontal line', () => {
            expect(root).toMatchSnapshot();
        });
    });
});
