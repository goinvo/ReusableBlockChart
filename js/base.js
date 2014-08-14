//For the 'defragmentor' block chart
d3.chart('BlockChart', {
  initialize: function(params) {
    if(params.width != undefined)
      this.w = params.width;
    else
      this.w = 250; // sets default values for variables
    if(params.height != undefined)
      this.h = params.height;
    else
      this.h = 250;
    if(params.margin != undefined)
      this.margin = params.margin;
    else
      this.margin = {'top' : 10, 'right' : 10, 'left' : 10, 'bottom' : 10};  
    if(params.columns != undefined)
      this.cols = params.columns;
    else
      this.cols = 10;
    if(params.rows != undefined)
      this.rows = params.rows;
    else
      this.rows = 1;
    if(params.pointSize != undefined)
      this.pointSize = params.pointSize;
    else
      this.pointSize = 10;
    if(params.possibleValues != undefined)
      this.pVals = params.possibleValues;
    else
      this.pVals = ['unknown', 'low', 'medium', 'high']; // Possible Categories (Values)
    if(params.mode != undefined) 
      this.mode = params.mode;
    else
      this.mode = "all";
    this.valCount = {}; // Count of items that belong to each possible catgory
    
    for(var k = 0; k < this.pVals.length; k++) { // resetting the value of all
      this.valCount[this.pVals[k]] = 0;
    }
    
    this.updateScales();
    
    this.initialData = [];
    this.percentData = [];
    this.tempData = [];
    $(this.base[0]).attr('height', this.h + 'px');
    $(this.base[0]).attr('width', this.w + 'px');
    $(this.base[0]).on("mouseleave", function(){ d3.selectAll('.active-point').classed("active-point", false); return tooltip.style("visibility", "hidden");   }).on("mousemove", function(){return tooltip.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px");});
    
    var tooltip = d3.select('body').append('div')
      .classed('tooltip', 'true')
      .style('position', 'absolute')
      .style('z-index', '1000')
      .style('visibility', 'hidden')
      .text('a simple tooltip');
    
    tooltip.on("mousemove", function(){return tooltip.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px");});
    
    
    var dataBase = this.base.append('g')
        .classed('all-points', true);

    this.layer('all-points', dataBase, {
      dataBind: function(data) {
        var chart = this.chart();
        chart.tempData = data;
        chart.rows = Math.ceil(data.length/chart.cols);
        chart.updateScales();
        data.sort(function(a,b) { var comparison =  chart.pVals.indexOf(a.value) - chart.pVals.indexOf(b.value); return comparison; });
        this.selectAll('.all-points>.point').remove();
        return this.selectAll('all-points').data(data); // return a data bound selection for the passed in data.

      },
      // setup the elements that were just created
      insert: function() {
        var chart = this.chart();
        var pointElements =  this.append('rect')  
          .attr('class', function(d) {return 'point category-' + chart.pVals.indexOf(d.value);})
          .attr('data-category', function(d) {return d.value;})
          .attr('data-category-index', function(d){return chart.pVals.indexOf(d.value);})
          .attr('y', function(d,i) { return chart.getYCoordinate(d,i); } )
          .attr('width', chart.pointSize + 'px')
          .attr('height', chart.pointSize + 'px')
          .each(function(d,i){if(chart.mode == "all") {chart.valCount[d.value] = chart.valCount[d.value] + 1;} })
          .on("click", function(d) { $(chart).trigger('chartElementClicked', [{"category" : d.value, "key" : d.key}]); })  // custom event with name 'chartElementClicked' thrown on the chart object
          .on("mousemove", function(){return tooltip.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px");})
          .on("mouseover", function(d, i){ 
              tooltip.style("visibility", "visible");
              var catPerc = chart.getPercentage(d.value);
              tooltip.html('<span class = "tooltip-category">Category: ' + d.value + '</span><br><span class ="tooltip-category-num"># of items: ' + chart.valCount[d.value] + '</span><br><span class = "category-percentage">Percentage: ' + catPerc.toFixed(1) + '%</span>'); 
            d3.selectAll('.active-point').classed("active-point", false);  
            d3.selectAll('.category-' + chart.pVals.indexOf(d.value)).classed("active-point", true);
          }).on("mouseout", function(){
	            //d3.selectAll('.active-point').classed("active-point", false);
	         });
        
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
    $(this.base[0]).attr('width', this.w);
    this.updateScales();
    this.updateThePoints();
    return this;
  },  
  height: function(newHeight) { // height getter-setter
    if (arguments.length === 0) {
      return this.h;
    }
    this.h = newHeight;
    this.updateScales();
    this.updateThePoints();
    $(this.base[0]).attr('height', this.h);
    return this;
  },
  columns: function(newColNumber) { // sets the maximum number of columns
    if (arguments.length === 0) {
      return this.cols;
    }
    this.cols = newColNumber;
    this.updateScales();
    this.updateThePoints();
    return this;
  },
  row: function(newRowNumber) { // gets the current number of rows (defaults to 10 but should update after data is added)
      return this.rows;
  },
  pointSize: function(newSize) { // sets the size for each point
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
      return this.pVals;
    }
    this.pVals = values;
    this.valCount = {};
    
    for(var k = 0; k < this.pVals.length; k++) { // resetting the value of all
      this.valCount[this.pVals[k]] = 0;
    }
    d3.selectAll('.all-points .point').each(function(d,i) { 
      if(this.pVals.indexOf(d.value) >= 0) {
        this.valCount[d.value] = this.valCount[d.value] + 1;
      }
      else {
        this.remove();
      }
    });
    this.updateThePoints();
  },
  valueCount: function() { // getter for the object that holds the count of all items by value
    return this.valCount;
  },
  updateScales: function () { // resets the scales used for drawing the points
    this.xScale = d3.scale.linear().domain([1, this.cols]).range([0 + this.margin['left'], this.w - this.margin['right'] - this.pointSize]);
    this.yScale = d3.scale.linear().domain([1, this.rows]).range([0 + this.margin['top'], this.h  - this.margin['bottom'] - this.pointSize]);
  },
  updateThePoints: function() { // Redraws all of the points
      this.layer('all-points').selectAll('.point')
          .attr('y', function(d,i) {  return this.getYCoordinate(d,i); } )
          .attr('x', function(d,i) { return this.getXCoordinate(d,i); })
          .attr('width', this.pointSize + 'px')
          .attr('height', this.pointSize + 'px');

  },
  
  getXCoordinate: function(d, i) { // returns the x-coordinate for a point   *** currently set for simply making 1 graphpoint per datapoint
    return this.xScale(i - ((Math.ceil(((i+1)/this.cols))-1)*this.cols) + 1) + 'px'; // x = index - ((column-1) * (# of columns))
  },
  getYCoordinate: function(d, i) { // returns the y-coordinate for a point  *** currently set for simply making 1 graphpoint per datapoint
    return this.yScale(Math.ceil(((i+1)/this.cols))) + 'px'; // y = index / (# of rows)
  },
  getPercentage: function(category) { // returns the perctenage of points with that category (value)
    var catPerc = 0;
    for(var k = 0; k < this.pVals.length; k++) {
      catPerc = catPerc + this.valCount[this.pVals[k]];
    }
    if(catPerc != 0) { catPerc = this.valCount[category]/catPerc*100; }
    return catPerc;
  },
  getMode: function() { // returns the perctenage of points with that category (value)
    return this.mode;
  },
  showPercentages: function() { // Changes the display to percentages **** Fix rounding error
    this.rows = 10;
    this.mode = "percent";
    if(this.initialData.length === 0) {
      this.initialData = this.tempData;
    }
    var totalPoints = this.rows * this.cols;
    var tempNumberOfPoints = 0;
    this.percentData = []; // Reset the percentage data because we should calculate it everytime (in case the data changes)
    var numPercentElements = {}; // The number of elements for each category based off of percentage
    var percentElementDecimals = []; // An array of the truncated decimal places after Integer Parsing
    
    for(var k = 0; k < this.pVals.length; k ++) {  // get percentages and number of points for each category based on percentage (because we are parsing integers, the total number of points is less than the requested total number)
      perc =  this.getPercentage(this.pVals[k]);
      numElements = totalPoints*perc/100; // Number of elements (non-integer)
      numPercentElements[this.pVals[k]] = parseInt(numElements);
      percentElementDecimals.push({ "key" : this.pVals[k],"value" : numElements - numPercentElements[this.pVals[k]]});
      tempNumberOfPoints = tempNumberOfPoints + numPercentElements[this.pVals[k]];
    }
    percentElementDecimals.sort(function(a,b) { return b.value - a.value;});
    var leftOverPoints = totalPoints - tempNumberOfPoints;
    for(var n = 0; n < leftOverPoints; n++) {  // Adding one point to every element that has a decimal place (starting with the decimal place closest to 1) until we reach the requested total (columns * rows).
      numPercentElements[percentElementDecimals[n]["key"]]++;
    }
    
    for(var i = 0;i < this.pVals.length; i ++) {
      for (var l = 0; l < numPercentElements[this.pVals[i]]; l++) {
        this.percentData.push({ "key" : "???", "value" : this.pVals[i]}); 
      }
    }
      
      this.draw(this.percentData);
    //this.updateThePoints();
    return this;
  },
  showAllPoints: function() { // Changes the display to all points
    this.mode = "all";
    if(this.initialData.length === 0) {
      this.draw(this.tempData); 
    }
    else {
      this.draw(this.initialData);
    }
    //this.updateThePoints();
    return this;
  }
});