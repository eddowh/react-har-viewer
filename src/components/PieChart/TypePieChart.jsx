import React from 'react';
import d3 from 'd3';
import _  from 'lodash';
import chartBuilder from './ChartBuilder';


export default class TypePieChart extends React.Component {

  constructor() {
    super();
    this.state = {
      svgWidth: 275,
      svgHeight: 275,
      width: 125,
      height: 125
    };
  }

  componentDidMount() {
    this.buildChart(this.props.entries)
  }

  componentWillReceiveProps(props) {
    if (this.props.entries.length !== props.entries.length) {
      this.buildChart(props.entries);
    }
  }

  buildChart(entries) {
    var groups = this.getEntriesByGroup(entries || []),
      config = {
        width: this.state.width,
        height: this.state.height
      };

    chartBuilder(groups, this.refs.container.getDOMNode(), config);
  }

  getEntriesByGroup(entries) {
    return _.chain(entries)
      .groupBy(function (x) {
        return x.type;
      })
      .map(function (g, key) {
        return {
          type: key,
          count: g.length
        }
      })
      .value();
  }

  render() {
    var center = {
      x: this.state.svgWidth / 2,
      y: this.state.svgHeight / 2
    };

    return (
      <svg width={this.state.svgWidth} height={this.state.svgHeight}>
        <g ref="container" transform={`translate(${center.x}, ${center.y})`}></g>
      </svg>
    );
  }

};

TypePieChart.defaultProps = {
  entries: null
};
