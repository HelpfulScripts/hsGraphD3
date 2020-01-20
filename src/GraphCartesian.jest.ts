
import { GraphCartesian as Graph } from './GraphCartesian';

const root = window.document.createElement("div");

describe('Graph', () => {
    it('should exist', () => 
        expect(new Graph(root)).not.toBeUndefined()
    );
});
