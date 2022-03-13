import { drawForcedDirectedGraph as ForcedDirectedGraph } from './ForcedDirectedGraph/forcedDirectedGraph.js';

(function() { //OnLoad event
    d3.json("./data/graph3.json", function (error, graph) {
		if (error) throw error;
        ForcedDirectedGraph(graph, "#force_directed_graph");
	});
})();