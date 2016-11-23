(function() {
  var width = 1200,
    height = 800;

  var root = d3.select("#interactions")
        .append("svg")
        .attr("height", height)
        .attr("width", width)
        
  var svg = root.append("g");
  
  var defs = svg.append("defs")

    // defs.append("marker")
    //     .attr("id","arrow")
    //     .attr("viewBox", "0 -5 10 10")
    //     .attr("refX", 39)
    //     // .attr("refY", 0)
    //     .attr("refY", -2)
    //     .attr("markerWidth", 6)
    //     .attr("markerHeight", 6)
    //     .attr("orient", "auto")
    //     .append("path")
    //     .attr("d", "M0,-5L10,0L0,5");

  // pulls nodes together that have some sort of link
  var forceLink = d3.forceLink()
    .id(function(d) { return d.character; })
    .strength(3)

  // default strength of -30
  // which means it pushes apart with a strength
  // of 30
  var manyBody = d3.forceManyBody()
    .strength(-10)

  var simulation = d3.forceSimulation()
    .force("manybody", manyBody)
    .force("link", forceLink)
    .force("x", d3.forceX(width / 2).strength(1.5))
    .force("y", d3.forceY(height / 2).strength(1.5))
    .force("collide", d3.forceCollide(70))
    .alphaTarget(0)
    .velocityDecay(0.95)

  /*
    Create your simulation here
    Node-link charts (can) require forceManyBody, forceCenter, forceCollide, forceLink, forceX and forceY
  */

  var colorScale = d3.scaleOrdinal().domain(['friendship', 'romantic', 'family', 'work', 'default'])
    .range(['yellow', 'red', 'lightblue', 'green', 'gray'])

  d3.queue()
    .defer(d3.json, "interactions.json")
    .await(ready)

  function ready (error, graph) {
    // 'datapoints' has been renamed to 'graph'
    // all our links are graph.links
    // all of our nodes are graph.nodes

    /*
      Our pattern wants to look something like this
      <pattern height="100%" width="100%" patternContentUnits="objectBoundingBox">
        <image height="1" width="1" preserveAspectRatio="none" xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="snow.png"></image>
      </pattern>
    */

    defs.selectAll(".character-pattern")
      .data(graph.nodes)
      .enter().append("pattern")
      .attr("class", "character-pattern")
      .attr("id", function(d) {
        // console.log(d.character.split(' ')[0].toLowerCase())
        // everyone has a unique name, so this should be okay
        return d.character.split(' ')[0].toLowerCase()
      })
      .attr("height", "100%")
      .attr("width", "100%")
      .attr("patternContentUnits", "objectBoundingBox")
      .append("image")
      .attr("height", 1)
      .attr("width", 1)
      .attr("preserveAspectRatio", "none")
      .attr("xmlns:xlink", "http://www.w3.org/1999/xlink")
      .attr("xlink:href", function(d) {
        return "images/" + d.character.split(' ')[0].toLowerCase() + ".jpg"
      })

    var draggable = d3.drag()
     .on("start", dragstarted)
     .on("drag", dragged)
     .on("end", dragended)

    var links = svg.selectAll("line")
        .data(graph.links)
        .enter().append("line")
        .attr("stroke", function(d) {
          return colorScale(d.relationship)
        })
        .attr("fill", "none")
        .attr("stroke-width", function(d) {
          return (d.weight-1)*2
        })
        .attr("id", function(d) {
          return "line-" + d.id;
        })

    var nodes = svg.selectAll(".artist")
      .data(graph.nodes)
      .enter().append("circle")
      .attr("class", "artist")
      .attr("r", 40)
      .attr("fill", function(d) {
      //   // "url(#jon-snow)"
      //   // kind of like "url(#" + "jon-snow" + ")"
        return "url(#" + d.character.split(' ')[0].toLowerCase() + ")"
      })
      // .attr('fill', 'blue')
      .attr('stroke', 'gray')
      .attr('stroke-width', '5px')
      .call(draggable)

    simulation.nodes(graph.nodes)
      .on('tick', ticked)

    // lets go grab the force we called 'links'
    // and tell it about the links between nodes
    simulation.force("link")
        .links(graph.links);

    function ticked() {
      links
        .attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });

      // link.attr("d", function(d) {
      //     var dx = d.target.x - d.source.x,
      //       dy = d.target.y - d.source.y,
      //       dr = Math.sqrt(dx * dx + dy * dy);
      //     return "M" + d.source.x + "," + d.source.y + "A" + dr + "," + dr + " 0 0,1 " + d.target.x + "," + d.target.y;
      //   })

      nodes
        .attr("cx", function(d) { return d.x; })
        .attr("cy", function(d) { return d.y; });

    }

    function dragstarted(d) {
      if (!d3.event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(d) {
      d.fx = d3.event.x;
      d.fy = d3.event.y;
    }

    function dragended(d) {
      if (!d3.event.active) simulation.alphaTarget(0);
    }

  }

})();