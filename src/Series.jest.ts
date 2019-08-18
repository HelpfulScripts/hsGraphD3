
import * as hsGraphD3 from './';
import { Series } from './Series';

const root = window.document.createElement("div");

describe('Series', () => {
    let graph:any;
    beforeAll(() => {
        graph = new hsGraphD3.GraphCartesian(root);
    });
    it('should exist', () => 
        expect(Series).not.toBeUndefined()
    );
    it(`should have 'line' type`, () => {
        expect(Series.types).toContain('line');
    });
    it(`should have 'bubble' type`, () => {
        expect(Series.types).toContain('bubble');
    });
    it(`should not have 'nonsense' type`, () => {
        expect(Series.types).not.toContain('nonsense');
    });
});
