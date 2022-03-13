var defaultWidth = 650,
	defaultHeight = 400,
	defaultSelector = "#my_dataviz";

function drawArcDiagram(data, htmlSelector = defaultSelector, svg_width = defaultWidth, svg_height = defaultHeight) {
	// set the dimensions and margins of the graph
	var margin = {top: 0, right: 30, bottom: 50, left: 60};
	var width = svg_width - margin.left - margin.right;
	var height = svg_height - margin.top - margin.bottom;

	// append the svg object to the body of the page
	var svg = d3.select(htmlSelector)
		.append("svg")
			.attr("width", width + margin.left + margin.right)
			.attr("height", height + margin.top + margin.bottom)
		.append("g")
			.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	// List of node names
	var allNodes = data.nodes.map(function(d){
		return d.name;
	});

	// List of groups
	var allGroups = data.nodes.map(function(d) {
		return d.label;
		});
	allGroups = [...new Set(allGroups)];

	var connectionCounter = {};
	allGroups.forEach((item, index)=>{
		connectionCounter[item] = 0;
		});

		data.links.forEach((item, index)=>{
			connectionCounter[item.source]+=1;
			connectionCounter[item.target]+=1;
		});

	// A color scale for groups:
	var color = d3.scaleOrdinal()
		.domain(allGroups)
		.range(d3.schemeSet3);

	// A linear scale for node size
	var size = d3.scaleLinear()
		.domain([1,10])
		.range([2,10]);

	// A linear scale to position the nodes on the X axis
	var x = d3.scalePoint()
		.range([0, width])
		.domain(allNodes);

	// In my input data, links are provided between nodes -id-, NOT between node names.
	// So I have to do a link between this id and the name
	var idToNode = {};
	data.nodes.forEach(function (n) {
		idToNode[n.id] = n;
	});

	// Add the links
	var links = svg
		.selectAll('mylinks')
		.data(data.links)
		.enter()
		.append('path')
		.attr('d', function (d) {
		var start = x(idToNode[d.source].name);    // X position of start node on the X axis
		var end = x(idToNode[d.target].name);      // X position of end node
		return ['M', start, height-30,    // the arc starts at the coordinate x=start, y=height-30 (where the starting node is)
			'A',                            // This means we're gonna build an elliptical arc
			(start - end)/2, ',',    // Next 2 lines are the coordinates of the inflexion point. Height of this point is proportional with start - end distance
			(start - end)/2, 0, 0, ',',
			start < end ? 1 : 0, end, ',', height-30] // We always want the arc on top. So if end is before start, putting 0 here turn the arc upside down.
			.join(' ');
		})
		.style("fill", "none")
		.attr("stroke", "grey")
		.style("stroke-width", 1);

	// Add the circle for the nodes
	var nodes = svg
		.selectAll("mynodes")
		.data(data.nodes.sort(function(a,b) {
			return +b.id - +a.id;
		}))
		.enter()
		.append("circle")
		.attr("cx", function(d) {
			return (x(d.name));
			})
		.attr("cy", height-30)
		.attr("r", function(d){
			return connectionCounter[d.id]*1.5;
			//return (size(d.id)); //Return size of the circle
			})
		.style("fill", function(d) {
			return color(d.label);
			})
		.attr("stroke", "white");

	// And give them a label
	var labels = svg
		.selectAll("mylabels")
		.data(data.nodes)
		.enter()
		.append("text")
		.attr("x", 0)
		.attr("y", 0)
		.text(function(d) {
			return(d.name);   //Write node label here
			})
		.style("text-anchor", "end")
		.attr("transform", function(d){
			return ("translate(" + (x(d.name)) + "," + (height-15) + ")rotate(-45)");
			})
		.style("font-size", 10);

	// Add the highlighting functionality
	nodes
		.on('mouseover', function (d) {
		// Highlight the nodes: every node is green except of him
		nodes
			.style('opacity', .2)
		d3.select(this)
			.style('opacity', 1)
		// Highlight the connections
		links
			.style('stroke', function (link_d) {
				return link_d.source === d.id || link_d.target === d.id ? color(d.label) : '#b8b8b8';
			})
			.style('stroke-opacity', function (link_d) {
				return link_d.source === d.id || link_d.target === d.id ? 1 : .2;
			})
			.style('stroke-width', function (link_d) {
				return link_d.source === d.id || link_d.target === d.id ? 4 : 1;
			})
		labels
			.style("font-size", function(label_d){
				return label_d.name === d.name ? 20 : 10;
			})
			.attr("y", function(label_d){
				return label_d.name === d.name ? 10 : 0;
			})
		})
		.on('mouseout', function (d) {
		nodes.style('opacity', 1);
		links
			.style('stroke', 'grey')
			.style('stroke-opacity', .8)
			.style('stroke-width', '1');
		labels
			.style("font-size", 10 );
		});
	
}

//Export Function
export { drawArcDiagram as drawArcDiagram };