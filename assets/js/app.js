// @TODO: YOUR CODE HERE!
// following day 3 activity 9
d3.select(window).on("resize", handleResize);

// When the browser loads, loadChart() is called
loadChart();

function handleResize() {
  var svgArea = d3.select("svg");

  // If there is already an svg container on the page, remove it and reload the chart
  if (!svgArea.empty()) {
    svgArea.remove();
    loadChart();
  }
}
function loadChart() {


  var svgWidth = window.innerWidth;
  var svgHeight = window.innerHeight;

  // var svgWidth = 960;
  // var svgHeight = 500;

  var margin = {
    top: 30,
    right: 50,
    bottom: 60,
    left: 100
  };

  var width = svgWidth - margin.left - margin.right;
  var height = svgHeight - margin.top - margin.bottom;

  // using D3 techniques to create a scatter plot
  // Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
  var svg = d3.select("#scatter")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

  var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);


  // Import Data from csv file
  d3.csv("./assets/data/data.csv").then(function (StatesData) {

    // Step 1: Parse Data/Cast as numbers
    // ==============================
    StatesData.forEach(function (data) {
      data.poverty = +data.poverty;
      data.healthcare = +data.healthcare;
      console.log(data);
    });



    // Step 2: Create scale functions
    // ==============================
    var xLinearScale = d3.scaleLinear()
      .domain([8, d3.max(StatesData, d => d.poverty)])
      .range([0, width]);

    var yLinearScale = d3.scaleLinear()
      .domain([0, d3.max(StatesData, d => d.healthcare)])
      .range([height, 0]);

    // Step 3: Create axis functions
    // ==============================
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // Step 4: Append Axes to the chart
    // ==============================
    chartGroup.append("g")
      .attr("transform", `translate(0, ${height})`)
      .style("font-size", "16px")
      .call(bottomAxis);

    chartGroup.append("g")
      .call(leftAxis);

    // Step 5: Create Circles
    // ==============================
    var circlesGroup = chartGroup.append("g")
      .selectAll("circle")
      .data(StatesData)
      .enter()
      .append("circle")
      .attr("cx", d => xLinearScale(d.poverty))
      .attr("cy", d => yLinearScale(d.healthcare))
      .attr("r", "15")
      .attr("fill", "blue")
      .attr("opacity", ".5")
      .attr("class", "stateCircle");

    // 5 part 2: 
    var circlesText = chartGroup.append("g")
      .selectAll("text")
      .data(StatesData)
      .enter()

      .append("text")
      // add text abbv.
      .text(d => d.abbr)
      // need to use scale
      .attr("x", d => xLinearScale(d.poverty) - 0.5)
      .attr("y", d => yLinearScale(d.healthcare) + 5)
      .attr("font-size", 13)
      // .attr("fill", "light blue")
      .attr("stroke", "black")
      .html(function (d) {
        return (`${d.abbr}`)
      })
      .attr("class", "stateText");
    // .attr("r", 3);




    // Step 6: Initialize tool tip
    // ==============================
    var toolTip = d3.tip()
      .attr("class", "d3-tip")
      .offset([80, -60])
      .html(function (d) {
        return (`${d.state}<br>poverty: ${d.poverty}<br>healthcare: ${d.healthcare}`);
      });

    // Step 7: Create tooltip in the chart
    // ==============================
    chartGroup.call(toolTip);

    // Step 8: Create event listeners to display and hide the tooltip
    // ==============================
    circlesText.on("click", function (data) {
      toolTip.show(data, this);
    })
      // onmouseout event
      .on("mouseout", function (data, index) {
        toolTip.hide(data);
      });

    // Create axes labels
    chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left + 40)
      .attr("x", 0 - (height / 2))
      .attr("dy", "1em")
      .attr("class", "aText")
      .text("Poverty (%)");

    chartGroup.append("text")
      .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
      .attr("class", "aText")
      .text("Healthcare (%)");
  }).catch(function (error) {
    console.log(error);
  });
}