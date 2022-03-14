import { drawArcDiagram as ArcDiagram } from './ArcDiagram/arcDiagram.js';

(function() { //OnLoad event
    d3.json("./data/graph3.json", function (error, graph) {
        if (error) throw error;
        ArcDiagram(graph, "#my_dataviz");
      });
})();
