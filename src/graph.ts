export interface Node {
    name: string;
}

export interface Edge<T extends any = any> {
    value: any;
    from: Node;
    to: Node;
}

export class Graph {

    adjacency: Map<string, Map<string, Set<Edge>>> = new Map();

    nodes: Set<Node> = new Set();

    edges: Set<Edge> = new Set();

    constructor () { }

    addNode (node: Node): Graph {

        if (this.nodes.has(node)) return this;

        this.nodes.add(node);

        this.adjacency.set(node.name, new Map());

        return this;
    }

    addEdge (edge: Edge): Graph {

        if (this.edges.has(edge)) return this;

        this.addNode(edge.from);
        this.addNode(edge.to);

        this.edges.add(edge);

        if (!this.adjacency.get(edge.from.name)!.has(edge.to.name)) {

            this.adjacency.get(edge.from.name)?.set(edge.to.name, new Set());
        }

        this.adjacency.get(edge.from.name)!.get(edge.to.name)!.add(edge);

        return this;
    }

    hasEdge (from: string, to: string): boolean {

        return !!this.adjacency.get(from)?.get(to)?.size;
    }
}

const adjacencyList = {
    initial: {
        'load': 'loading',
    },
    loading: {
        'success': 'success',
        'error': 'error',
    },
    success: {},
    error: {
        'retry': 'loading'
    },
};
