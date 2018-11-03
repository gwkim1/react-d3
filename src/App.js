import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import logo from './logo.svg';
import './App.css';
import BarChart from "./BarChart.js";
import LineChart from "./LineChart.js";
import Inputs from "./Inputs.js";
import batCSV from "./bat.csv";
import * as d3 from "d3";
import {groupBy, buildStats, filterByEquality} from './Utils.js';


class App extends Component {
    constructor(props) {
      super(props);

      const height = 700;
      const width = height * 2;
      const margin = {top: 30, left: 30, right: 30, bottom: 30};
      this.state = {
        dataFileName: "bat.csv",
        width: 300,
        height: 500,
        id: "root",
        chartSpec: {
          height: height,
          width: width,
          margin: margin,
          plotHeight: height-margin.top-margin.bottom,
          plotWidth: width-margin.left-margin.right,
        },
        data: this.props.data, // raw data
        inputSpec : {
          Yes : true,
          No : true,
        },
        plotData: null, // data for plotting
      }
      this.filterData = this.filterData.bind(this);
    }

    componentDidMount() {
      // any attribute other than this.state can be added at any time!
      console.log("component did mount, will run filterdata");
      this.filterData(this.state.inputSpec, this.state.data);
    }

  componentDidUpdate() {
    console.log("update on App: ", this.state.inputSpec);
    //console.log("plotdata after componentDidUpdate: ", this.state.plotData);
  }

/*
  filterData() {
      let filteredData = [];
      if (this.state.inputSpec.Yes != null) {
          filteredData = filteredData.concat(filterByEquality(this.state.data, 'inducted', 'Y'));
      }
      console.log(filteredData.length);
      if (this.state.inputSpec.No != null) {
          filteredData = filteredData.concat(filterByEquality(this.state.data, 'inducted', 'N'));
      }
      console.log(filteredData.length);
    //}
    const dict = groupBy(filteredData, 'playerID');
    //const dict = groupBy(this.state.data, 'playerID');
    const lineData = [];
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

    Object.keys(dict)
          .forEach(key => {
            lineData.push({
              playerID: key,
              data: dict[key]
            });
          });

    console.log('lineData', lineData);
    this.state.plotData = lineData;
  }
*/

  filterData(inputSpec, data)  {
      console.log("filterdata run");
      let filteredData = [];
      if (inputSpec.Yes != null) {
          filteredData = filteredData.concat(filterByEquality(data, 'inducted', 'Y'));
      }
      console.log(filteredData.length);
      if (inputSpec.No != null) {
          filteredData = filteredData.concat(filterByEquality(data, 'inducted', 'N'));
      }
      console.log(filteredData.length);
    //}
    const dict = groupBy(filteredData, 'playerID');
    //const dict = groupBy(this.state.data, 'playerID');
    const lineData = [];
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

    Object.keys(dict)
          .forEach(key => {
            lineData.push({
              playerID: key,
              data: dict[key]
            });
          });


    this.setState({plotData: lineData});
    // this may return the previous plotData, because react stacks
    // instead, use componentDidUpdate
    // https://stackoverflow.com/questions/41446560/react-setstate-not-updating-state/41446620
    //console.log('this.state.plotData after plotData set', this.state.plotData);

  }

/*

*/
  render() {
    return (
      <div className="App">
        <LineChart dataFileName={this.state.dataFileName}
                   chartSpec={this.state.chartSpec}
                   data={this.state.data}
                   plotData={this.state.plotData}
                   inputSpec={this.state.inputSpec}/>
        <Inputs inputSpec={this.state.inputSpec}
                data={this.state.data}
                plotData={this.state.plotData}
                handleClick={this.filterData}/>

      </div>
    );
  }
}

export default App;
