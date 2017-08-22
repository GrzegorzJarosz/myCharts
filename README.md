# My Chart

## Content

Simple js library for displaying data in chart, with index.html example.

version 1.0

## How to use

1. You need two files: chart.js and chartStyle.css.

2. add references to chart.js (body section) and chartStyle.css (head section) in your html file.

3. in your html file:

* in ```<body>``` section
insert ```<div id="my-chart"></div>``` (in this div, chart will be draw. You can use any name of id ).
* in your own js file or ```<script>``` section insert data for chart,
data for chart should be object created as follows:

```
var dataForChart={dataPoints: [{ x: value, y: value },  ...  , {xn:value n,yn:value n}]};
```

and some required data for chart in that way:

```
var chart= new Chart({
   container: "my-chart",      //id of div with chart (the same as in body section)
   title: "My first chart",    // title of chart
   nameXval: "X values",       // title of X values
   nameYval: "Y values",       // title of Y values
   helpAxes:{
      X:false,                 // display(true) or not(false) axis
      Y:true                   // display(true) or not(false) axis
   },
   chartSize:{                 //size of svg element (chart)
      height:500,
      width:900
   },
   colors:{
      background:'#e6e6e6',    // background color
      line:'#07A9EA'           // line color
   },
   dataValues:dataForChart     // name of variable where data are stored
});

```
4. ...and its ready to use...
