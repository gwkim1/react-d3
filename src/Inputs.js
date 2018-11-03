import React, {Component} from 'react';
import * as d3 from "d3";

//const LineChart = React.createClass({
class Inputs extends Component {

  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(event) {
    //console.log("target:", event.target, event.target.name, event.target.checked, !event.target.checked);
    const name = event.target.name;

    this.props.inputSpec[name] == null ? this.props.inputSpec[name] = 'checked' : this.props.inputSpec[name] = null;
    console.log("Inputs.inputSpec:", this.props.inputSpec);
    this.props.handleClick(this.props.inputSpec, this.props.data); //this should set state's plotData
    this.props.inputSpec[name] = event.target.checked;
  }

  render() {
    return <div id="inputs">
      Inducted?
      <input type="checkbox" name="Yes" checked={this.props.inputSpec.Yes} onChange={this.handleClick}/> Yes
      <input type="checkbox" name="No" checked={this.props.inputSpec.No} onChange={this.handleClick}/> No
    </div>
  }
}


export default Inputs;
