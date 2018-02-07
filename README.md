# My Chart

## Content

Simple js library for displaying data in a chart. An example index.html has been provided as well.

version 1.0

### live

https://grzegorzjarosz.github.io/myCharts/

## How to use

1. You need two files: chart.js and chartStyle.css.

2. add a references to chart.js (body section) and chartStyle.css (head section) in your html file.

3. in your html file:

* in the ```<body>``` section
insert ```<div id="my-chart"></div>``` (the chart will be drawn in this div. You can use any ID you like, as long as you reference the right one later).
* in your own js file or ```<script>``` section insert data for the chart. It should be an object created as follows:

```
var dataForChart={dataPoints: [{ x: value, y: value },  ...  , {xn:value n,yn:value n}]};
```

* and some required data for the chart as per the example below:

```
var chart= new Chart({
   container: "my-chart",      // id of the div containing the chart (the same as in body section)
   title: "My first chart",    // title of the chart
   nameXval: "X values",       // title of X values
   nameYval: "Y values",       // title of Y values
   helpAxes:{
      X:false,                 // display(true) or not(false) axis
      Y:true                   // display(true) or not(false) axis
   },
   chartSize:{                 // size of the svg element (chart)
      height:500,
      width:900
   },
   colors:{
      background:'#e6e6e6',    // background color
      line:'#07A9EA'           // line color
   },
   dataValues:dataForChart     // variable where data are stored
});

```
4. ...and its ready to use...
