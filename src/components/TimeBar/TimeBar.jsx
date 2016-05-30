// React
import React, {Component, PropTypes} from 'react';
import ReactDOM from 'react-dom';
import {OverlayTrigger, Popover} from 'react-bootstrap';

// Subcomponents
import TimingDetails from './TimingDetails.jsx';

// Stylesheets
require('../../css/timebar.scss');

// Helpers
import formatter from '../../core/formatter.js';


export default class TimeBar extends Component {

  constructor() {
    super();
    this.state = {};
  }

  render() {
    var value = (v) => {
      return `${this.props.scale(v)}%`;
    }
    var bars = [
      {
        type: 'time',
        style: {
          left: value(this.props.start),
          width: value(this.props.total)
        },
        className: 'timebar-mark-time'
      },
      {
        type: 'contentLoad',
        style: {
          left: value(this.props.domContentLoad),
          width: 1
        },
        className: 'timebar-mark-contentLoad'
      },
      {
        type: 'pageLoad',
        style: {
          left: value(this.props.pageLoad),
          width: 1
        },
        className: 'timebar-mark-pageLoad'
      }
    ]
    var label = formatter.time(this.props.total);

    var barElements = _.chain(bars)
      .map((b)=>{
        return (
          <div key={b.type} className={`timebar-mark ${b.className}`} style={b.style}>
          </div>
        )
      })
      .value();

    var overlay = (
      <Popover title={`Timing Details, started at: ${formatter.time(this.props.start)}`}>
        <TimingDetails
          timings={this.props.timings}
          start={this.props.start}
          total={this.props.total}
        />
      </Popover>
    );

    return (
        <OverlayTrigger
        trigger={['hover', 'focus']}
        placement="left"
        delay={0}
        overlay={overlay}>
        <div className="timebar">
          {barElements}
          <span className="timebar-label">{label}</span>
        </div>
      </OverlayTrigger>
    );
  }

}

TimeBar.defaultProps = {
  scale: null,
  start: 0,
  total: 0,
  timings: null,
  domContentLoad: 0,
  pageLoad: 0
};

TimeBar.propTypes = {
  scale: PropTypes.func,
  start: PropTypes.number,
  total: PropTypes.number,
  timings: PropTypes.object,
  domContentLoad: PropTypes.number,
  pageLoad: PropTypes.number
};
