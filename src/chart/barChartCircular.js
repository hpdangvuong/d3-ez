/**
 * Bar Chart (vertical) (also called: Bar Chart; Bar Graph)
 *
 * @see http://datavizproject.com/data-type/circular-bar-chart/
 */
d3.ez.chart.barChartCircular = function module() {
  // SVG and Chart containers (Populated by 'my' function)
  var svg;
  var chart;

  // Default Options (Configurable via setters)
  var classed = "barChartCircular";
  var width = 400;
  var height = 300;
  var margin = { top: 20, right: 20, bottom: 20, left: 40 };
  var transition = { ease: d3.easeBounce, duration: 500 };
  var colors = d3.ez.colors.categorical(4);

  // Chart Dimensions
  var chartW;
  var chartH;
  var radius;
  var innerRadius;

  // Scales and Axis
  var xScale;
  var yScale;
  var xAxis;
  var yAxis;
  var colorScale;

  // Data Variables
  var maxValue;
  var categoryNames;

  // Dispatch (Custom events)
  var dispatch = d3.dispatch("customValueMouseOver", "customValueMouseOut", "customValueClick", "customSeriesMouseOver", "customSeriesMouseOut", "customSeriesClick");

  function init(data) {
    chartW = width - (margin.left + margin.right);
    chartH = height - (margin.top + margin.bottom);

    var defaultRadius = Math.min(chartW, chartH) / 2;
    radius = (typeof radius === 'undefined') ? defaultRadius : radius;
    innerRadius = (typeof innerRadius === 'undefined') ? defaultRadius / 4 : innerRadius;

    // Slice Data, calculate totals, max etc.
    var slicedData = d3.ez.dataParse(data);
    categoryNames = slicedData.categoryNames;
    maxValue = slicedData.maxValue;

    if (!colorScale) {
      // If the colorScale has not already been passed
      // then attempt to calculate.
      colorScale = d3.scaleOrdinal()
        .range(colors)
        .domain(categoryNames);
    }

    // X & Y Scales
    xScale = d3.scaleBand()
      .domain(categoryNames)
      .rangeRound([radius, innerRadius])
      .padding(0.15);

    yScale = d3.scaleLinear()
      .domain([0, maxValue])
      .range([0, 0.75]);

    categoryScale = d3.scaleBand()
      .domain(categoryNames)
      .rangeRound([radius, innerRadius])
      .padding(0.15);

    // X & Y Axis
    xAxis = d3.axisBottom(xScale);
    yAxis = d3.axisLeft(yScale);
  }

  function my(selection) {
    selection.each(function(data) {
      // Initialise Data
      init(data);

      // Create SVG element (if it does not exist already)
      if (!svg) {
        svg = (function(selection) {
          var el = selection._groups[0][0];
          if (!!el.ownerSVGElement || el.tagName === "svg") {
            return selection;
          } else {
            return selection.append("svg");
          }
        })(d3.select(this));

        svg.classed("d3ez", true)
          .attr("width", width)
          .attr("height", height);

        chart = svg.append("g").classed("chart", true);
        chart.append("g").classed("circularAxis", true);
        chart.append("g").classed("barsCircular", true);
        chart.append("g").classed("verticalAxis axis", true);
        chart.append("g").classed("circularLabels", true);
      } else {
        chart = selection.select(".chart");
      }

      // Update the chart dimensions
      chart.classed(classed, true)
        .attr("transform", "translate(" + (width / 2) + "," + (height / 2) + ")")
        .attr("width", chartW)
        .attr("height", chartH);

      /*
      // Circular Axis
      var circularAxis = d3.ez.component.circularAxis()
        .xScale(xScale)
        .yScale(yScale)
        .width(chartW)
        .height(chartH)
        .radius(radius);

      chart.select(".circularAxis")
        .call(circularAxis);

      // Circular Labels
      var circularLabels = d3.ez.component.circularLabels()
        .radius(radius * 1.04);

      chart.select(".circularLabels")
        .datum(categoryNames)
        .call(circularLabels);
      */

      // Radial Bar Chart
      var barsCircular = d3.ez.component.barsCircular()
        .radius(function(d) { return xScale(d.key) })
        .innerRadius(function(d) { return xScale(d.key) + xScale.bandwidth(); })
        .yScale(yScale)
        .colorScale(colorScale)
        .dispatch(dispatch);

      chart.select(".barsCircular")
        .datum(data)
        .call(barsCircular);

      // Vertical Axis
      var verticalAxis = d3.axisLeft(categoryScale);
      chart.select(".verticalAxis")
        .attr("transform", "translate(0," + -((chartH / 2) + innerRadius) + ")")
        .call(verticalAxis);

    });
  }

  // Configuration Getters & Setters
  my.width = function(_) {
    if (!arguments.length) return width;
    width = _;
    return this;
  };

  my.height = function(_) {
    if (!arguments.length) return height;
    height = _;
    return this;
  };

  my.colors = function(_) {
    if (!arguments.length) return colors;
    colors = _;
    return this;
  };

  my.colorScale = function(_) {
    if (!arguments.length) return colorScale;
    colorScale = _;
    return this;
  };

  my.transition = function(_) {
    if (!arguments.length) return transition;
    transition = _;
    return this;
  };

  my.dispatch = function(_) {
    if (!arguments.length) return dispatch();
    dispatch = _;
    return this;
  };

  my.on = function() {
    var value = dispatch.on.apply(dispatch, arguments);
    return value === dispatch ? my : value;
  };

  return my;
};
