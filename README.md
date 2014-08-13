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
<div id = "chart-container"> </div>
```

4. In a seperate .js file or inline, create a variable to store your data in the following format:

  ```javascript
  var data = [{"key" : "name-0", "value" : "low"} , {"key" : "name-1", "value" : "high"}, ... {"key" : "name-n", "value" : "medium"}}
  ```
  
5. Using d3, select the div that you want the chart to be placed in, append an svg element, and initize the chart (with an optional object of preferences. More information on this data in the 'initalize my my chart' section)

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