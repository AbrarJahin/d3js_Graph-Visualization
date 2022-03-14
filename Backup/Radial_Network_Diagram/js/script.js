import { drawRadialNetworkDiagram as RadialNetworkDiagram } from './RadialNetworkDiagram/drawRadialNetworkDiagram.js';

(function() { //OnLoad event
	d3.json("./data/adjacency_list.json", function(error, classes) {
		if (error) throw error;
		RadialNetworkDiagram(classes);
	});
})();