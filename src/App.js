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
          inducted : {
            Yes : false,
            No : false,
          },
          Stat : 'HR',
        },
        plotData: null, // data for plotting
      }
      this.filterData = this.filterData.bind(this);
      this.handleDropDownChange = this.handleDropDownChange.bind(this);
    }

    componentDidMount() {
      // any attribute other than this.state can be added at any time!
      console.log("component did mount, will run filterdata");
      this.filterData(this.state.inputSpec.inducted, this.state.data);
    }

  componentDidUpdate() {
    console.log("update on App: ", this.state.inputSpec.inducted);
  }

  filterData(inducted, data)  {
      console.log("filterdata run");
      let filteredData = [];
      if (inducted.Yes != null) {
          filteredData = filteredData.concat(filterByEquality(data, 'inducted', 'Y'));
      }
      console.log(filteredData.length);
      if (inducted.No != null) {
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

  handleDropDownChange(chosenStat) {
    // to handle nested updates: check the below post
    //https://stackoverflow.com/questions/43040721/how-to-update-nested-state-properties-in-react
    var inputSpec = this.state.inputSpec;
    console.log("inputSpec", inputSpec);
    inputSpec.Stat = chosenStat;
    console.log("inputSpec after changing stat", inputSpec);
    this.setState({inputSpec: inputSpec});
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
                handleClick={this.filterData}
                handleChange={this.handleDropDownChange}/>

      </div>
    );
  }
}

export default App;
