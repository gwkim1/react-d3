import React, {Component} from 'react';
import * as d3 from "d3";

//const LineChart = React.createClass({
class Inputs extends Component {

  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleClick(event) {
    //console.log("target:", event.target, event.target.name, event.target.checked, !event.target.checked);
    const name = event.target.name;

    this.props.inputSpec.inducted[name] == null ? this.props.inputSpec.inducted[name] = 'checked' : this.props.inputSpec.inducted[name] = null;
    console.log("Inputs.inputSpec.inducted:", this.props.inputSpec.inducted);
    this.props.handleClick(this.props.inputSpec.inducted, this.props.data); //this should set state's plotData
    this.props.inputSpec.inducted[name] = event.target.checked;
  }

  handleChange(event) {
    const value = event.target.value;
    console.log("value chosen by dropdown:", value);
    console.log("old stat", this.props.inputSpec.Stat);
    // Inputs can't change its parent component's inputSpec.
    // need to use parent (App.js)'s function to change it.'
    this.props.handleChange(value);
    console.log("new stat", this.props.inputSpec.Stat);
  }

  render() {
    return <div id="input">
        <div id="inducted">
          Inducted?
          <input type="checkbox" name="Yes" checked={this.props.inputSpec.inducted.Yes} onChange={this.handleClick}/> Yes
          <input type="checkbox" name="No" checked={this.props.inputSpec.inducted.No} onChange={this.handleClick}/> No
        </div>
        <div id="stats">
          Stats to show:
          <select value={this.props.inputSpec.Stat} onChange={this.handleChange}>
            <option value="AB">AB</option>
            <option value="R">R</option>
            <option value="H">H</option>
            <option value="RBI">RBI</option>
            <option value="SB">SB</option>
            <option value="BB">BB</option>
            <option value="IBB">IBB</option>
            <option value="SO">SO</option>
            <option value="HR">HR</option>
          </select>
        </div>
      </div>
  }
}


export default Inputs;
