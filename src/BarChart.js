import React, {Component} from 'react';
import * as d3 from "d3";

class BarChart extends Component {
  constructor(props) {
    super(props);
    console.log("props", props);
  }

  componentDidMount() {
    this.drawChart();
  }

  drawChart() {
    const data = [12, 5, 6, 6, 9, 10];
    console.log(this.props.id);
    const svg = d3.select("#barChart")
      .append("svg")
      .attr("width", this.props.width)
      .attr("height", this.props.height);

    console.log(this.props.width / this.props.data.length);
    svg.selectAll("rect")
      .data(data)
      .enter()
      .append("rect")
      .attr("x", (d, i) => this.props.width / this.props.data.length * i)
      .attr("y", d => this.props.height - d * 10)
      .attr("width", this.props.width / this.props.data.length * 0.9)
      .attr("height", (d, i) => d * 10)
      .attr("fill", "green");

    svg.selectAll("text")
      .data(data)
      .enter()
      .append("text")
      .text(d => d)
      .attr("x", (d, i) => this.props.width / this.props.data.length * i)
      .attr("y", (d, i) => this.props.height - d * 10 - 3)
      .attr("color", "black");
  }

  render() {
    return <div id="barChart"></div>
  }
}

export default BarChart;
