
import { Graph } from './Graph';

const root = window.document.createElement("div");

describe('Graph', () => {
    it('should exist', () => 
        expect(new Graph(root)).not.toBeUndefined()
    );
});
