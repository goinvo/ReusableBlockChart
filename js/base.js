d3.chart('BlockChart', {
  initialize: function() {
    this.w = 250; // sets default values for variables
    this.h = 200;
    this.margin = {'top' : 10, 'right' : 10, 'left' : 10, 'bottom' : 10}; // ***** write a getter-setter??? ******
    this.cols = 10;
    this.rows = 1;
    this.pointSize = 10;
    this.updateScales();
    this.pVals = ['low', 'medium', 'high', 'unknown']; // Possible Categories (Values)
    this.valCount = {'low' : 0, 'medium' : 0 , 'high' : 0, 'unknown' : 0}; // Count of items that belong to each possible catgory
    this.mode = "all";
    this.initialData = [];
    this.percentData = [];
    this.tempData = [];
    $(this.base[0]).attr('height', this.h + 'px');
    $(this.base[0]).attr('width', this.w + 'px');
    
    
    var tooltip = d3.select('body').append('div')
      .classed('tooltip', 'true')
      .style('position', 'absolute')
      .style('z-index', '1000')
      .style('visibility', 'hidden')
      .text('a simple tooltip');
    
    var dataBase = this.base.append('g')
        .classed('all-points', true);

    this.layer('all-points', dataBase, {
      dataBind: function(data) {
        var chart = this.chart();
        chart.tempData = data;
        chart.rows = Math.ceil(data.length/chart.cols);
        chart.updateScales();
        data.sort(function(a,b) { var comparison =  chart.pVals.indexOf(a.value) - chart.pVals.indexOf(b.value); return comparison; });
        this.selectAll('.all-points>rect').remove();
        return this.selectAll('all-points').data(data); // return a data bound selection for the passed in data.

      },
      // setup the elements that were just created
      insert: function() {
        var chart = this.chart(); 
        var pointElements =  returning = this.append('rect')  
          .attr('class', function(d) {return 'category-' + chart.pVals.indexOf(d.value);})
          .attr('data-category', function(d) {return d.value;})
          .attr('data-category-index', function(d){return chart.pVals.indexOf(d.value);})
          .attr('y', function(d,i) { return chart.getYCoordinate(d,i); } )
          .attr('width', chart.pointSize + 'px')
          .attr('height', chart.pointSize + 'px')
          .each(function(d,i){ chart.valCount[d.value] = chart.valCount[d.value] + 1; })
          .on("mouseover", function(d, i){ 
            var catPerc = chart.getPercentage(d.value);
            tooltip.html('<span class = "tooltip-category">Category: ' + d.value + '</span><br><span class ="tooltip-category-num"># of items: ' + chart.valCount[d.value] + '</span><br><span class = "category-percentage">Percentage: ' + catPerc.toFixed(1) + '%</span>'); 
            tooltip.style("visibility", "visible");
            d3.selectAll('.category-' + chart.pVals.indexOf(d.value)).attr("stroke", "black").attr("stroke-width", "10px").attr("stroke-opacity", .1);
            })
	      .on("mousemove", function(){return tooltip.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px");})
	      .on("mouseout", function(d){
            d3.selectAll('.category-' + chart.pVals.indexOf(d.value)).attr("stroke", "").attr("stroke-width", "").attr("stroke-opacity", "");
            return tooltip.style("visibility", "hidden");});
        
        return pointElements;
      },

      // setup an enter event for the data as it comes in:
      events: {
        'enter' : function() {
          var chart = this.chart();        
          // position newly entering elements
          return this.attr('x', function(d,i) { return chart.getXCoordinate(d,i); });
        },
        'exit' : function() {
          var chart = this.chart();        
          // position newly entering elements
          return this.remove();
        }
      }
    });
    
  },
  width: function(newWidth) { // width getter-setter
    if (arguments.length === 0) {
      return this.w;
    }
    this.w = newWidth;
    this.updateScales();
    $(this.base[0]).attr('width', this.q);
    return this;
  },  
  height: function(newHeight) { // height getter-setter
    if (arguments.length === 0) {
      return this.h;
    }
    this.h = newHeight;
    this.updateScales();
    $(this.base[0]).attr('height', this.h);
    return this;
  },
  columns: function(newColNumber) { // sets the maximum number of columns
    if (arguments.length === 0) {
      return this.cols;
    }
    this.cols = newColNumber;
    this.updateScales();
    return this;
  },
  row: function(newRowNumber) { // gets the current number of rows (defaults to 10 but should update after data is added)
      return this.rows;
  },
  pointSizes: function(newSize) { // sets the size for each point
    if (arguments.length === 0) {
      return this.pointSize;
    }
    this.pointSize = newSize;
    this.updateScales();
    this.updateThePoints();
    return this;
  },
  possibleValues: function(values) { // sets the categories (aka possible data values). Takes in an array of values e.g ['low', 'medium', 'high', 'unkown'], items will be sorted by 
    if (arguments.length === 0) {
      return chart.pVals;
    }
    chart.pVals = values;
    chart.valCount = {};
    
    for(var k = 0; k < chart.pVals.length; k++) { // resetting the value of all
      chart.valCount[chart.pVals[k]] = 0;
    }
    d3.selectAll('.all-points rect').each(function(d,i) { 
      if(chart.pVals.indexOf(d.value) >= 0) {
        chart.valCount[d.value] = chart.valCount[d.value] + 1;
      }
      else {
        this.remove();
      }
    });
    chart.updateThePoints();
  },
  valueCount: function() { // getter for the object that holds the count of all items by value
    return this.valCount;
  },
  updateScales: function () { // resets the scales used for drawing the points
    this.xScale = d3.scale.linear().domain([1, this.cols]).range([0 + this.margin['left'], this.w - this.margin['right'] - this.pointSize]);
    this.yScale = d3.scale.linear().domain([1, this.rows]).range([0 + this.margin['top'], this.h  - this.margin['bottom'] - this.pointSize]);
  },
  updateThePoints: function() { // Redraws all of the points
      chart.layer('all-points').selectAll('rect')
          .attr('y', function(d,i) {  return chart.getYCoordinate(d,i); } )
          .attr('x', function(d,i) { return chart.getXCoordinate(d,i); })
          .attr('width', chart.pointSize + 'px')
          .attr('height', chart.pointSize + 'px');

  },
  
  getXCoordinate: function(d, i) { // returns the x-coordinate for a point   *** currently set for simply making 1 graphpoint per datapoint
    return this.xScale(i - ((Math.ceil(((i+1)/this.cols))-1)*this.cols) + 1) + 'px'; // x = index - ((column-1) * (# of columns))
  },
  getYCoordinate: function(d, i) { // returns the y-coordinate for a point  *** currently set for simply making 1 graphpoint per datapoint
    return this.yScale(Math.ceil(((i+1)/this.cols))) + 'px'; // y = index / (# of rows)
  },
  getPercentage: function(category) { // returns the perctenage of points with that category (value)
    var catPerc = 0;
    for(var k = 0; k < chart.pVals.length; k++) {
      catPerc = catPerc + chart.valCount[chart.pVals[k]];
    }
    if(catPerc != 0) { catPerc = chart.valCount[category]/catPerc*100; }
    return catPerc;
  },
  getMode: function() { // returns the perctenage of points with that category (value)
    return chart.mode;
  },
  showPercentages: function() { // Changes the display to percentages **** Fix rounding error
    chart.rows = 10;
    chart.mode = "percent";
    if(chart.initialData.length === 0) {
      chart.initialData = chart.tempData;
    }
    var totalPoints = chart.rows * chart.cols;
    chart.percentData = [];
    for(var k = 0; k < chart.pVals.length; k ++) {
      perc = chart.getPercentage(chart.pVals[k]);
      numElements = parseInt(totalPoints*perc/100);
      for (var l = 0; l < numElements; l++) {
        chart.percentData.push({ "key" : "???", "value" : chart.pVals[k]}); 
      }
      
      chart.draw(chart.percentData);
    }
    
    
    //this.updateThePoints();
    return this;
  },
  showAllPoints: function() { // Changes the display to all points
    chart.mode = "all";
    if(chart.initialData.length === 0) {
      chart.draw(chart.tempData); 
    }
    else {
      chart.draw(chart.initialData);
    }
    //this.updateThePoints();
    return this;
  }
});