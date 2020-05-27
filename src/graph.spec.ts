import { suite, test, assert } from 'browser-test'
import { Graph, Node, Edge } from './graph';

suite('Graph', () => {

    test('create graph', () => {

        const foo: Node = { name: 'foo' };
        const bar: Node = { name: 'bar' };
        const foobar: Edge = { from: foo, to: bar, value: 'foobar' };

        const graph = new Graph();

        graph
            .addNode(foo)
            .addNode(bar)
            .addEdge(foobar);

        assert(graph.hasEdge('foo', 'bar'));
    });
});
