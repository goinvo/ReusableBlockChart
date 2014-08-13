ReusableBlockChart
==================
<div align = "center">
  <img src = "http://code.goinvo.com/opencharts/blockchart/example.png">
</div>
A reusable block chart that plots a dataset by category. You can have one point (block) per datapoint or you can plot by percentage.

##### [Click here to see the demo](http://code.goinvo.com/opencharts/blockchart/)

## How to Use:

1. Download [d3.js](http://d3js.org/), [d3.chart](http://misoproject.com/d3-chart/), [jquery](http://jquery.com/), and [modernizer](http://modernizr.com/).

2. Insert the following code before the end of ```</head>```-tag.

```html
<!-- jQuery libary -->
<script src="lib/jquery.min.js"></script>
<!-- d3 -->
<script src="lib/d3.min.js"></script>
<!-- d3.chart -->
<script src="lib/d3.chart.min.js"></script>
<!-- modernizer -->
<script src="lib/modernizr.min.js"></script>
 <!-- Chart Base -->
<script src="js/base.js"></script>
```

3.  In your html file, create a div with a unique ID. e.g.

```html
<div id ="chart-container"> </div>
```

4. In a seperate .js file or inline, create a variable to store your data in the following format:

```javascript
var data = [{"key" : "name-0", "value" : "low"} , {"key" : "name-1", "value" : "high"}, ... {"key" : "name-n", "value" : "medium"}};
```
  
5. Using d3, select the div that you want the chart to be placed in, append an svg element, and initialize the chart (with an optional parameter of preferences. More information on this data in the 'initalize my my chart' section)

```javascript
var chart = d3.select("#chart-container")
  .append("svg")
  .chart("BlockChart", {
    "height" : 225,
    "width" : 225,
    "columns" : 10,
    "pointSize" : 15,
    "margin" : {"top" : 15, "right" : 15, "left" : 15, "bottom" : 15},
    "possibleValues" : ["unknown", "low", "medium", "high"]
  });
```

6. Bind your data to the chart (just like you would do in good ol' d3)

```javascript
chart.draw(data);
```
  
7. If you want to call any of the chart methods (such as _showPercentages(), to switch to percent mode), now is the time!

```javascript
chart.showPercentages();
```

## Initializing the Chart

To initialize your chart, select the div that you want the chart to be placed in, append an svg element, and call ```.chart("BlockChart", {...})```. e.g.

```javascript
var chart = d3.select("#chart-container")
  .append("svg")
  .chart("BlockChart", {
    "height" : 225,
    "width" : 225,
    "columns" : 10,
    "pointSize" : 15,
    "margin" : {"top" : 15, "right" : 15, "left" : 15, "bottom" : 15},
    "possibleValues" : ["unknown", "low", "medium", "high"]
  });
```

### Preference Parameters
A list of all possible prefernces that you can configure when initializing the chart

```javascript
.chart("BlockChart", {
    "height" : 225,
    "width" : 225,
    "columns" : 10,
    "pointSize" : 15,
    "margin" : {"top" : 15, "right" : 15, "left" : 15, "bottom" : 15},
    "possibleValues" : ["unknown", "low", "medium", "high"]
  })
```

1. **Width** - An integer that represents the width of the chart (this includes the inner margins). When setting the width, be sure to think about the number of columns, block size, an spacing between points. 

  This defaults to 250px.

  ```javascript
  "width" : 225
  ```

2. **Height** - An integer that represents the height of the chart (this includes the inner margins). When setting the height, be sure to think about the number of rows (calculated by # of points/# of columns), block size, an spacing between points. When showing percentages, you probably want the width and height to be equal, as the chart looks best in a square.

  This defaults to 250px.

  ```javascript
  "height" : 225
  ```

3. **Margin** - An JSON object containing the amount of space between the edge of the svg and the points (this is probably more synonymous with padding of the outer div). You must use the following format:

  This defaults to ```{'top' : 10, 'right' : 10, 'left' : 10, 'bottom' : 10}```.

  ```javascript
  "margin" : {'top' : 10, 'right' : 10, 'left' : 10, 'bottom' : 10}
  ```

4. **Columns** - The number of columns to be used in the chart. The number of rows is calculated from the # of points/# of columns. (tip: when plotting percentage, I like to keep the number of columns at '10' so I have a nice square 10x10 plot).

  This defaults to 10.

  ```javascript
  "columns" : 10
  ```

5. **Point Size** - The height & width of each square point in pixels. When setting this value, make sure you take note of the width & height of the chart, the margins, the number of columns, and the spacing that you want between points.

  This defaults to 10.

  ```javascript 
  "pointSize" : 15
  ```

6. **Possible Values** - This parameter is almost always necessary. This is an array of the possible values (or categories) that any point can have. The order of this array determines the order of the categories. The value at index 0 will be the category who's points are at the top of the chart, while the value at the last index will be the category who's points are at the bottom of the chart. The index is also used for styling of each category's points. If a datapoint has a value that is not in this array, it will not be drawn on the chart.

  This defaults to ```['unknown', 'low', 'medium', 'high']``` (where the points who's category is 'unknown' are at the top of the graph [blue in the image at the top of this page] and 'high' are at the bottom [red in the image at the top of this page).

  ```javascript
  "possibleValues" : ["unknown", "low", "medium", "high"]
  ```

## Methods

Many of these methods are simply used as getters/setters for the initialization parameters listed above.

1. ``` width([newWidth]) ```

2. ``` height([newHeight]) ```

3. ``` columns([newNumberOfColumns]) ```

4. ``` rows() ```
  
  Returns the calculated number of rows. This is calculated by (# of points)/(# of columns).

5. ``` pointSize([newPointSize]) ```

6. ``` possibleValues([newArrayofPossibleValues]) ```

7. ``` valueCount() ```
  
  Returns a JSON object of the number of points for each value (category). e.g. ``` {"unknown" : 10, "low" : 24, "medium" : 22, "high" : 45} ```
  
8. ``` updateScales() ```
  
  Should you ever need to recalculate the x and y scales, call this function. All methods that would need this to happen already call this function.
  
9. ``` updateThePoints() ```
  
  Redraws all of the points on the screen.
  
10. ``` getXCoordinate(d,i) ```
  
  Used internally to return the x-coordinate of a specific point

11. ``` getYCoordinate(d,i) ```
  
  Used internally to return the y-coordinate of a specific point
  
12. ``` getMode() ```
  
  Returns the current mode of the graph. (possible values are "All" or "Percent").

13. ``` showPercentages() ```
  
  Changes the chart mode to "Percent". The total number of points is changed to 100 and is proportionally distributed throughout the categories. For the nicest possible graph, I suggest setting the number of columns to 10 and changing the width and height so that they are equal. This will give you a nice 10x10 square chart.
  
  You cannot call this until after you have called ``` chart.draw(data) ```.
  
14. ``` showAllPoints() ```
  
  Changes the chart mode to "all". This is the default mode. Each point on the chart represents a datapoint.
  

### Chart Events

1. When a point on the chart is clicked on, the event **chartElementClicked** is triggered. You can create a listener for this event with the following code after initializing the chart.
  
  ```javascript
  $(chart).on('chartElementClicked', function(e, eventData) {
    // enter code here  
  });
  ```
  
  ``` eventData ``` contains the data bound to the element that you clicked on. So it will be in the format ``` { "key" : "category-0", "value" : "high" } ```
  
  
2. When the cursor hovers over a point, all points with the same category are given a class of ``` .active-point ```. The tooltip is also displayed.


## Styling the Chart

See the stylesheet *css/style.css* for specific examples.

1. ``` .point ``` 

  All points on the graph are given this classname of ``` .point ```. Each point is an svg element ``` <rect> ``` and you can style them as you would any other svg element.
  
3. ``` .active-point ```

  When the cursor hovers over a point, the classname of ``` .active-point ``` is given to every point that belongs in the category (aka has the same value). You can use this to highlight an entire category. 
  
4. `` .category-0 `` , ``` .category-1 ```, ..., ``` .category-n ```

  Every point is given a classname that is chosen based on its category ``` .category-# ```, where "category" is literally the word category and "#" the index of the category (value) in the array of possible values.
  
  e.g. 
  
  ```javascript 
  chart.possibleValues(["unknown", "low", "medium", "high"]);
  ```
  
  | Value (Category) | Classname   |
  | ---------------- | ----------- |
  | unknown          | .category-0 |
  | low              | .category-1 |
  | medium           | .category-2 |
  | high             | .category-3 |
  
  
  This is useful for setting the colors (or various other styles) for each category.
  
5. ``` .tooltip ```

  This is the classname given to the tooltip.