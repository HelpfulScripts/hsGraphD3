import * as hsGraphD3   from '../';
import { Log }          from 'hsnode'; const log = new Log('Line.jest.jest');
import * as d3          from 'd3';
import { DataSet }      from '../Graph';

let clientWidth = 300;
const root = window.document.createElement("div");
root.style.width = `${clientWidth}px`;
root.style.height = "300px";

d3.selection.prototype.transition   = function(){ return this; };
d3.selection.prototype.duration     = function(){ return this; };
d3.selection.prototype.ease         = function(){ return this; };
// d3.selection.prototype.on           = function(event:string, cb:any) { 
//     log.info(`on called for ${event}`);
//     if (event === 'end') {
//         setTimeout(cb, 100); 
//     }
// };

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
    graph.axes.defaults.hor.numTicksMinor = 10;
    graph.axes.defaults.hor.numTicksMajor = 2;
    graph.axes.defaults.ver.numTicksMinor = 10;
    graph.axes.defaults.ver.numTicksMajor = 2;
    return graph;
}

// function update(data:DataSet, done:()=>void) {
//     done();
//     return false;
// }


describe('Line', () => {
    let graph:hsGraphD3.GraphCartesian;

    describe('plot data', () => {
        beforeAll(() => {
            jest.useFakeTimers();
            graph = createGraph(root);
            // jest.runAllTimers();
            graph.series.add('line', {x:'xval', y:'yval', r:'rval', popup:null});
            // jest.runAllTimers();
            graph.axes.defaults.color = '#666';
            graph.render(data); //  .update(200, (data:DataSet) => update(data, done));
            // jest.runAllTimers();
        });
        it(`should have 'line' registered`, () =>
            expect(graph.seriesTypes).toContain('line')
        );
        it('should support settings changes', () => {
            expect(graph.axes.defaults.color).toBe('#666');
        });
        it('should plot line', () =>
            expect(root).toMatchSnapshot()
        );
    });

    describe('plot constants', () => {
        beforeEach(() => {
            graph = createGraph(root);
            graph.series.add('line', {x:'xval', y:10});
            graph.render(data);
        });
        it('should plot horizontal line', () => {
            expect(root).toMatchSnapshot();
        });
    });

    describe('plot function', () => {
        beforeEach(() => {
            graph = createGraph(root);
            graph.series.add('line', {x:'xval', y:()=>10});
            graph.render(data);
        });
        it('should plot horizontal line', () => {
            expect(root).toMatchSnapshot();
        });
    });

    describe('plot indexed', () => {
        beforeEach(() => {
            graph = createGraph(root);
            graph.series.add('line', { y:'yval'});
            graph.render(data);
        });
        it('should plot horizontal line', () => {
            expect(root).toMatchSnapshot();
        });
    });
});
