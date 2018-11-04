import React, {Component} from 'react';
import * as d3 from "d3";
import * as d3Tip from "d3-tip";
import {groupBy, buildStats, filterByEquality} from './Utils.js'
import batCSV from './bat.csv'
// Had to install d3 v4, originally it was v5 which failed to get the data

class LineChart extends Component {
  constructor(props) {
    super(props);
    //this.handleMouseOver = this.handleMouseOver.bind(this);
    //this.handleMouseOut = this.handleMouseOut.bind(this);
  }

  componentDidMount() {
    this.drawChart();
  }

  componentDidUpdate() {
    this.drawChart();
  }

  handleMouseOver(d, i) {
    // conflict between this being ev and this being something different.
    d3.select(this)
      //.transition().duration(500)
      .attr('stroke-width', '4.0');

    var p = d3.select("#lineChart")
        .append("p");
    p //.transition().duration(200)
        .attr("class", "tooltip")
        .style("height", 200).style("width", 200)
        .style("opacity", 0.8)
        .style("position", "absolute")
        .style("background-color", 'yellow')
        .style("left", d3.event.pageX + 'px')
        .style("top", d3.event.pageY+ 'px')
        //
        .text(d.data[0].name + " " + d.data[d.data.length-1].cumStat);
  }

  handleMouseOut(d, i) {
    d3.select(this).attr('stroke-width', '1.5');
    console.log("this selected in mouseout", d3.select(this)._groups[0]);
    // remove the diff for popup window
    var tooltip =  d3.select("p.tooltip");
    console.log("tooltip", tooltip);
    var textToRemove = tooltip._groups[0][0].innerText;
    tooltip
      //.transition().duration(100)
      .remove();
    console.log(textToRemove, "removed");
    //d3.select(".tooltip").remove();
    //console.log(this.parentNode);
  }

  drawChart() {
    var stat = this.props.inputSpec.Stat;
    var cumStat = 'cumStat';
      //if (nextprops != null) {
        var filteredData = [];
        //console.log("At Linechart, inputSpec:", this.props.inputSpec);
        //console.log("at Linechart, data: ", this.props.data);
        if (this.props.inputSpec.inducted.Yes ) {
            filteredData = filteredData.concat(filterByEquality(this.props.data, 'inducted', 'Y'));
        }
        ////console.log(filteredData.length);
        if (this.props.inputSpec.inducted.No ) {
            filteredData = filteredData.concat(filterByEquality(this.props.data, 'inducted', 'N'));
            ////console.log("filtered by N:", filterByEquality(this.props.data, 'inducted', 'N'));
        }
      //console.log("LineChart.drawchart, data length", filteredData.length, this.props.data.length);
      //}
      var dict = groupBy(filteredData, 'playerID');
      //var dict = groupBy(this.props.data, 'playerID');
      var lineData = [];
      Object.keys(dict)
        .forEach(key => {
          var sumStat = 0;
          for (var i = 0 ; i < dict[key].length; i++) {
              sumStat += Number(dict[key][i][stat]);
              dict[key][i][cumStat] = sumStat;
        }
      })

      console.log("data built:", dict);

      var stats = buildStats(this.props.data, cumStat);
      var yearStats = buildStats(this.props.data, 'yearID');

      var xScale = d3.scaleLinear().domain([yearStats.min, yearStats.max])
                       .range([0, this.props.chartSpec.plotWidth]);

      var yScale = d3.scaleLinear().domain([0, stats.max])
                       .range([this.props.chartSpec.plotHeight - this.props.chartSpec.margin.bottom, 0]);

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
                           .y(d => yScale(Number(d[cumStat])));

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
