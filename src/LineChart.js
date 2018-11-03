import React, {Component} from 'react';
import * as d3 from "d3";
import * as d3Tip from "d3-tip";
import {groupBy, buildStats, filterByEquality} from './Utils.js'
import batCSV from './bat.csv'
// Had to install d3 v4, originally it was v5 which failed to get the data

class LineChart extends Component {

  constructor(props) {
    super(props);
    ////console.log("props", props);
    /*
    this.state = {
      xScale : null,
      yScale: null,
    }
    */
  }

  componentDidMount() {
    this.drawChart();
  }

  componentDidUpdate() {
    ////console.log("linechart got updated! this.props.plotData: ", this.props.plotData.length);
    //console.log("linechart got updated! this.props.inputSpec: ", this.props.inputSpec);

    this.drawChart();
  }
/*
  componentWillReceiveProps(nextprops) {
    if (nextprops.inputSpec.Yes != this.props.inputSpec.Yes) {
      //console("called!");
      this.drawChart();
    }
*/
    //chttps://bl.ocks.org/johnnygizmo/3d593d3bf631e102a2dbee64f62d9de4
    // var's try a D3 apporach instead of a React approach.
  //}
/*
  componentDidMount() {
    this.intervalId = setInterval(this.drawChart.bind(this), 1000);
  }
  componentWillUnmount(){
    clearInterval(this.intervalId);
  }
*/

  handleMouseOver(d, i) {
    d3.select(this).transition().duration(500).attr('stroke-width', '4.0');

    var p = d3.select("#lineChart")
        .append("p");

    p.transition().duration(500)
        .attr("class", "tooltip")
        .style("height", 200).style("width", 200)
        .style("opacity", 0.8)
        .style("position", "absolute")
        .style("background-color", 'yellow')
        .style("left", d3.event.pageX + 'px')
        .style("top", d3.event.pageY+ 'px')
        // <br> doesn't work in svg
        .text(d.data[0].name + " " + d.data[d.data.length-1].cumHR);
        //.text("<tspan>" + d.data[0].name + "</tspan>" +
        //      "<tspan>" + d.data[d.data.length-1].cumHR + "</tspan>");
/*
    div
        .html(d.data[0].name + "<br>" + d.data[d.data.length-1].cumHR)
        .style("left", d3.event.pageX + 'px')
        .style("top", d3.event.pageY+ 'px')
        .style("height", 200).style("width", 200);



        var div = d3.select("#lineChart")
            .append("div")
            .attr("class", "tooltip")
            .style("height", 200).style("width", 200)
            .style("opacity", 0.5)
            .style("position", "absolute")
            .style("background-color", 'red');
            div.html(d.data[0].name + "<br>" + d.data[d.data.length-1].cumHR)
            .style("left", d3.event.pageX + 'px')
            .style("top", d3.event.pageY+ 'px')
            .style("height", 200).style("width", 200);
*/
/*
    d3.select(this.parentNode).append('text')
    .attr("font-size", '40px')
    .attr('x', 20).attr('y', 20)
    .attr('fill', '#000')
    .text("hello");
*/
/*
    console.log("d, i:", d, i, d.data[d.data.length-1]);
    d3.select(this.parentNode).append('text')
    .attr("font-size", '14px')
    .attr('x', d3.event.pageX)
    .attr('y', d3.event.pageY)
    //.attr('x', this.state.xScale(d.yearID))
    //.attr('y', this.state.yScale(d.data[d.data.length-1]))
    .attr('fill', '#000')
    .text(d.data[d.data.length-1].cumHR);
*/

    //d3.select('#lineChart').html("Hello");

    //.text(d => d);

    //console.log("selection of svg: ", d3.select("#lineChart").select('svg'));
/*
    d3.select("#lineChart").select('svg').append('text')
      .attr({
        id: i,  // Create an id for text so we can select it later for removing on mouseout
         x: 20,
         y: 20,
      })
      .text("Hello again"); */
  }

  handleMouseOut(d, i) {
    d3.select(this).attr('stroke-width', '1.5');

    // remove the diff for popup window
    var tooltip =  d3.select("p.tooltip");
    var textToRemove = tooltip._groups[0][0].innerText;
    tooltip.transition().remove();
    console.log(textToRemove, "removed");
    //d3.select(".tooltip").remove();
    //console.log(this.parentNode);
  }

  drawChart() {
      ////console.log("nextprops", nextprops);
      //if (nextprops != null) {
        var filteredData = [];
        //console.log("At Linechart, inputSpec:", this.props.inputSpec);
        //console.log("at Linechart, data: ", this.props.data);
        if (this.props.inputSpec.Yes ) {
            filteredData = filteredData.concat(filterByEquality(this.props.data, 'inducted', 'Y'));
        }
        ////console.log(filteredData.length);
        if (this.props.inputSpec.No ) {
            filteredData = filteredData.concat(filterByEquality(this.props.data, 'inducted', 'N'));
            ////console.log("filtered by N:", filterByEquality(this.props.data, 'inducted', 'N'));
        }
      //console.log("LineChart.drawchart, data length", filteredData.length);
      //}
      var dict = groupBy(filteredData, 'playerID');
      //var dict = groupBy(this.props.data, 'playerID');
      var lineData = [];
      Object.keys(dict)
        .forEach(key => {
          var sumH = 0;
          var sumHR = 0;
          for (var i = 0 ; i < dict[key].length; i++) {
              sumH += Number(dict[key][i]['H']);
              sumHR += Number(dict[key][i]['HR']);
              dict[key][i]['cumH'] = sumH;
              dict[key][i]['cumHR'] = sumHR;
        }
      })

      var hrStats = buildStats(this.props.data, 'cumHR');
      var hStats = buildStats(this.props.data, 'cumH');
      var yearStats = buildStats(this.props.data, 'yearID');

      var xScale = d3.scaleLinear().domain([yearStats.min, yearStats.max])
                       .range([0, this.props.chartSpec.plotWidth]);


      var yScale = d3.scaleLinear().domain([0, hrStats.max])
                       .range([this.props.chartSpec.plotHeight - this.props.chartSpec.margin.bottom, 0]);

      //this.setState({xScale: xScale, yScale: yScale});

      Object.keys(dict)
            .forEach(key => {
              lineData.push({
                playerID: key,
                data: dict[key]
              });
            });

      //this.setState({lineData: lineData});
      ////console.log('lineData', lineData);

      var lineEval = d3.line().x(d => xScale(Number(d.yearID)))
                           .y(d => yScale(Number(d.cumHR)));

      // this works perfectly, adding filtered plots
      // but very non-D3 solution I guess. you just remove each svg
      // and try to draw a new one.
      d3.select('#lineChart').select("svg").remove();
      var svg = d3.select('#lineChart').append("svg")
                    .attr('height', this.props.chartSpec.height)
                    .attr('width', this.props.chartSpec.width);

      // Note that this is different from the svg selection itself!
      // bind data to g, which would have path as its child
      // this is needed because text can't be inserted inside path
      // g would have both text and path
      var gs = svg.selectAll("g")
                    .data(lineData);
/*
      var texts = svg.selectAll("text")
        .data(lineData);

      texts.enter().append("text")
        .attr("d", d=>d);
*/
      console.log(lineData);
      var paths = gs.enter().append('g').append('path')
          //.merge(svg)
          .attr('stroke-width', '1.5')
          .attr('stroke', d => d.data[0].inducted == 'N' ? 'red' : 'blue')
          .attr("class", "line")
          .attr('fill', 'none')
          .attr("d", d=>lineEval(d.data))

          //.on("mouseover", tip.show)
          //.on("mouseout", tip.hide);
          .on("mouseover", this.handleMouseOver)
          .on("mouseout", this.handleMouseOut)
          .on("click", this.handleMouseClick);
      var texts = gs.enter().append('text')
        .attr("font-size", '40px')
        .attr('x', d => xScale(Number(d.data[0].cumHR)))
        .attr('y', d => yScale(Number(d.data[0].yearID)))
        .attr('fill', '#000')
        .text("hello");
      console.log('texts', texts);

      var xAxis = d3.axisBottom(xScale);
      var yAxis = d3.axisRight(yScale);

      var xAxisObject = svg.append('g')
          .attr('font-size', 14)
          .attr('transform', `translate(0, ${this.props.chartSpec.plotHeight - this.props.chartSpec.margin.bottom})`)
          .call(xAxis);
      var yAxisObject = svg.append('g').attr('font-size', 30).call(yAxis);

      //tip = d3.tip().attr('class', 'd3-tip').html(function(d) { return d; });
  }

  render() {
    return <div id="lineChart"><svg></svg></div>
  }
}


export default LineChart;
