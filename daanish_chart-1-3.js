(function() {
	var margin = { top: 30, left: 40, right: 65, bottom: 50},
	height = 300 - margin.top - margin.bottom,
	width = 1000 - margin.left - margin.right;

	var svg = d3.select("#bar-graph-1")
		.append("svg")
		.attr("height", height + margin.top + margin.bottom)
		.attr("width", width + margin.left + margin.right)
		.append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	var xPositionScale=d3.scalePoint().domain([1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,
 		27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70,71,72,73,74,75,77,78,79]).range([0, width])
	.padding(2)

	var yPositionScale=d3.scaleLinear().range([height, 0]);

	d3.queue()
	.defer(d3.csv, "data.csv")
	.await(ready);

	function ready(error, datapoints) {

	// var minValue = d3.min(datapoints, function(d) { return +d.num_character });
  var maxValue = d3.max(datapoints, function(d) { return +d.num_character });
  yPositionScale.domain([0, maxValue]);

  svg.append("text")
    .attr("class", "xAxislabel")
    .attr("y", height+15)
    .attr("x", width/2)
    .text("Scene")
    .attr("dy", 35)
    .attr("dx", 0)
    .attr("fill", "black") 
    .attr("font-size", 18)
    .style("text-anchor", "middle")

  svg.selectAll(".barLinelabel")
    .data(datapoints.filter(function(d){
    	return d.scene==79
    }))
    .enter().append("text")
    .attr("class", "barLinelabel")
    .attr("y", function(d){
    	return yPositionScale(d.num_character)
    })
    .attr("x", function(d){
    		return xPositionScale(d.scene)
    })
  	.text("# Characters")
    .attr("dy", 0)
    .attr("dx", 5)

  svg.selectAll(".bar")
    .data(datapoints)
    .enter().append("rect")
    .attr("class", "bar")
    .attr("x", function(d) { return xPositionScale(d.scene); })
    .attr("y", function(d) { 
      return yPositionScale(d.num_character); })
    .attr("width", 5)
    .attr("height", function(d) { return height - yPositionScale(d.num_character); })
    .attr("fill", "#b61210")

	var xAxis = d3.axisBottom(xPositionScale)
    .tickValues([5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75]);

  svg.append("g")
    .attr("class", "axis x-axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis);

  var yAxis = d3.axisLeft(yPositionScale)
    // .tickValues([5, 10, 15, 20]);
  svg.append("g")
    .attr("class", "axis y-axis")
    .call(yAxis);

	}

})();