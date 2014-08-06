var data = [1,3,4,6,10, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 5, 5, 5, 5, 5, 5, 5,5 ,5 ,5 ,5, 5];
console.log("number of blocks: " + data.length);
var chart = d3.select("#chart-container")
  .append("svg")
  .chart("BlockChart").row(7);

chart.draw(data);