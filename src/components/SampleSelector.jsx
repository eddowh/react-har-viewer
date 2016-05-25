/**
 * Sample selector.
 */

import React, {Component, PropTypes} from 'react';
import _ from 'lodash';
import {Grid, Row, Col, PageHeader, Button, ButtonGroup, Input, Alert} from 'react-bootstrap';


export default class SampleSelector extends Component {

  constructor() {
    super();
    this.state = {};
  }

  _initialState() {
    return {
      activeHar: null,
      // activeHar: _.find(window.samples, s => s.id == 'so').har,
      filterType: 'all',
      filterText: null,
      sortKey: null,
      sortDirection: null,
      // entries: []
    }
  }

  sampleChanged() {
    var selection = this.refs.selector.value;
    var har = selection
      ? _.find(window.samples, s => s.id === selection).har
      : null;

    if (this.props.onSampleChanged) {
      this.props.onSampleChanged(har);
    }
  }

  render() {
    var options = _.map(window.samples, (s) => {
      return (
        <option key={s.id} value={s.id}>
          {s.label}
        </option>
      );
    });

    return (
      <div>
        <label className="control-label"></label>
        <select ref="selector" className="form-control" onChange={this.sampleChanged.bind(this)}>
          <option value="">---</option>
          {options}
          </select>
      </div>
    );

  }

}

SampleSelector.defaultProps = {
  onSampleChanged: null
};

SampleSelector.propTypes = {
  onSampleChanged: PropTypes.func
};
