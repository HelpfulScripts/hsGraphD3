import * as hsGraphD3   from '../';
import * as d3          from 'd3';
import { DataSet }      from '../Graph';

let clientWidth = 300;
const root = window.document.createElement("div");
root.style.width = `${clientWidth}px`;
root.style.height = "300px";

d3.selection.prototype.transition   = function(){ return this; };
d3.selection.prototype.duration     = function(){ return this; };
d3.selection.prototype.ease         = function(){ return this; };

const data:DataSet = {
    colNames: ['State', 'volume', 'costs'], 
    rows:[    ['CA',     -1,       0.2], 
              ['MA',      0.2,     0.7], 
              ['FL',      0.4,     0.1],
              ['SC',      0.6,    -0.2], 
              ['NV',      0.8,     0.3], 
              ['NC',      1,       0.2]]
   };

describe('Column', () => {
    let graph:hsGraphD3.GraphCartesian;
    beforeAll(() => {
        graph = new hsGraphD3.GraphCartesian(root);
        graph.addSeries('column', {x:'State', y:'volume'});
        graph.render(data);
    });
    it(`should have 'column' registered`, () =>
        expect(graph.seriesTypes).toContain('bar')
    );
    it('should plot column', () =>
        expect(root).toMatchSnapshot()
    );
    it('should support settings changes', () => {
        graph.defaults.axes.color = '#666';
        expect(graph.defaults.axes.color).toBe('#666');
    });
});
