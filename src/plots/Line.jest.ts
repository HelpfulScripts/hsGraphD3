import * as hsGraphD3   from '../';
import { log }          from 'hsnode';
import * as d3 from 'd3';

let clientWidth = 300;
const root = window.document.createElement("div");
root.style.width = `${clientWidth}px`;
root.style.height = "300px";

d3.selection.prototype.duration   = function(){ return this; };
d3.selection.prototype.transition = function(){ return this; };


const data = [
    ['xval', 'yval', 'rval'],
    [-1,      15,     15],
    [0.2,      2,     23],
    [3,       28,     30],
    [7.5,     13,      8]
];

describe('Line', () => {
    let graph:hsGraphD3.GraphCartesian;
    beforeAll(() => {
        graph = new hsGraphD3.GraphCartesian(root);
        graph.addSeries('line', 'xval', 'yval', 'rval');
        graph.render(data);
    });
    it('should plot line', () =>
        expect(root).toMatchSnapshot()
    );
    it('should support settings changes', () =>
        expect(graph.defaults.axes.color).toBe('#000')
    );
    it(`should have 'line' registered`, () =>
        expect(graph.seriesTypes).toContain('line')
    );
    // it(`should respond to window resize`, (done) => {
    //     root.style.width = `200px`;
    //     const event = new UIEvent('resize');
    //     // document.createEvent('UIEvents');
    //     // event.initUIEvent('resize', true, false, window, 10);
    //     window.dispatchEvent(event);
    //     setTimeout(() => {
    //         expect(root).toMatchSnapshot();
    //         done();
    //     }, 500);
    //     // expect(root).toMatchSnapshot();
    // });
});
