
import { Graph2DCartesian as Graph } from './Graph2DCartesian';

const root = window.document.createElement("div");

describe('Graph', () => {
    it('should exist', () => 
        expect(new Graph(root)).not.toBeUndefined()
    );
});
