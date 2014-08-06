d3.chart("BlockChart", {
  initialize: function() {
    this.w = 250; // sets default values for variables
    this.h = 200;5
    this.cols = 10;
    this.rows = 1;
    this.xScale = d3.scale.linear().domain([1, this.cols]).range([0, this.w]);
    this.yScale = d3.scale.linear().domain([1, this.rows+1]).range([0, this.h]);
    this.pVals = ["low", "medium", "high", "unkown"];
    
    var dataBase = this.base.append("g")
        .classed("all-points", true);

    this.layer("all-points", dataBase, {
      dataBind: function(data) {
        var chart = this.chart();
        chart.rows = Math.ceil(data.length/chart.cols);
        
        chart.yScale = d3.scale.linear().domain([1, chart.rows+1]).range([0, chart.h]);
        // return a data bound selection for the passed in data.
        return this.selectAll("all-points")
          .data(data);

      },
      insert: function() {
        var chart = this.chart();
        var origNumPoints = chart.numPoints;  
        // setup the elements that were just created
        var returning = this.append("rect")
          .classed("rectangle", true)
          .style("fill", "red")  // just choosing a color for now
          .attr("y", function(d,i) {
            var offset = 0;
            if(i == 0) {offset = .0000000000000000001;}
            return chart.yScale(Math.ceil(((i+1)/chart.cols) + offset)) + "px"; // y = index / (# of rows)
          } )
          .attr("width", 10 + "px")
          .attr("height", 10 + "px");
        
        return returning;
      },

      // setup an enter event for the data as it comes in:
      events: {
        "enter" : function() {
          var chart = this.chart();        
          // position newly entering elements
          return this.attr("x", function(d,i) {
            var offset = 0;
            if(i == 0) {offset = .0000000000000000001;}
            return chart.xScale(i - ((Math.ceil(((i+1)/chart.cols) + offset)-1)*chart.cols) + 1) + "px"; // x = index - ((column-1) * (# of columns))
          });
        }
      }
    });
    
  },
  width: function(newWidth) { // width getter-setter
    if (arguments.length === 0) {
      return this.w;
    }
    this.w = newWidth;
    this.xScale = d3.scale.linear().domain([1, this.cols]).range([0, this.w]);
    return this;
  },  
  height: function(newHeight) { // height getter-setter
    if (arguments.length === 0) {
      return this.h;
    }
    this.h = newHeight;
    this.yScale = d3.scale.linear().domain([1, this.rows+1]).range([0, this.h]);
    return this;
  },
  columns: function(newColNumber) { // sets the maximum number of columns
    if (arguments.length === 0) {
      return this.cols;
    }
    this.cols = newColNumber;
    this.xScale = d3.scale.linear().domain([1, this.cols]).range([0, this.w]);
    this.yScale = d3.scale.linear().domain([1, this.rows+1]).range([0, this.h]);
    return this;
  },
  row: function(newRowNumber) { // gets the current number of rows (defaults to 10 but should update after data is added)
      return this.rows;
  },
  possibleValues: function(values) { // sets the categories (aka possible data values). Takes in an array of values e.g ["low", "medium", "high", "unkown"]
    if (arguments.length === 0) {
      return this.pVals;
    }
    this.pVals = values;
    return this;
  }
  
});