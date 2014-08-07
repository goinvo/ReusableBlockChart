var data = [1,3,4,6,10, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 5, 5, 5, 5, 5, 5, 5,5 ,5 ,5 ,5, 5, 1,3,4,6,10, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 5, 5, 5, 5, 5, 5, 5,5 ,5 ,5 ,5, 5, 1,3,4,6,10, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 5, 5, 5, 5, 5, 5, 5,5 ,5 ,5 ,5, 5,5, 5, 5, 5, 5,5 ,5 ,5 ,5, 5];

console.log("number of blocks: " + data.length);

var chart = d3.select("#chart-container")
  .append("svg")
  .chart("BlockChart").columns(10);

chart.draw(data);

console.log("number of columns: " + chart.cols);
console.log("number of rows: " + chart.rows);
console.log("width : " + chart.w);
console.log("height: " + chart.h);

