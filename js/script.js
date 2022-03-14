import { drawForcedDirectedGraph as ForcedDirectedGraph } from './ForcedDirectedGraph/forcedDirectedGraph.js';
import { drawArcDiagram as ArcDiagram } from './ArcDiagram/arcDiagram.js';
import { drawRadialNetworkDiagram as RadialNetworkDiagram } from './RadialNetworkDiagram/drawRadialNetworkDiagram.js';

var adjacencyListDataLocation = "./data/adjacency_list.json";
var nodeLinkDataLocation = "./data/node_link.json";

(function() { //OnLoad event
	d3.json(nodeLinkDataLocation, function (error, graph) {
		if (error) throw error;
		ForcedDirectedGraph(Object.assign({}, graph), "#force_directed_graph", 970, 330);
	});
	d3.json(nodeLinkDataLocation, function (error, graph) {
		if (error) throw error;
		ArcDiagram(Object.assign({}, graph), "#arc_diagram", 700, 340);
	});
	d3.json(adjacencyListDataLocation, function(error, classes) {
		if (error) throw error;
		RadialNetworkDiagram(classes, "#hierarchical_edge_bundling", 970, 340);
	});
})();