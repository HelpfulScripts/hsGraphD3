import { Graph }            from './Graph';
import { GraphCartesian }   from './GraphCartesian';
import { m }                from 'hslayout';

const root = window.document.createElement("div");

const data = {
    colNames: 
        ['xval', 'yval', 'rval'],
    rows : [
        [-1,      15,     15],
        [0.2,      2,     23],
        [3,       28,     30],
        [7.5,     13,      8]
    ]
};


describe('Label', () => {
    describe('should have DOM structure', () => {
        beforeAll(() => {
            m.mount(root, { view: () => m(GraphCartesian, {
                rootID: root,
                define: (graph:Graph) => {
                   graph.series.add('line', {y:'yval'});
                },
                data: data
            })});
        });
        it ('matches', () => {
            expect(root).toMatchSnapshot();
        });
    });
});