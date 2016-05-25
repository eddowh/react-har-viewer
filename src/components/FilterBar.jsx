/**
 * Filter bar.
 */


import React, {Component} from 'react';
import _ from 'lodash';
import {Row, Col, Button, ButtonGroup, Input} from 'react-bootstrap';

import mimeTypes from '../core/mimeTypes.js';


export default class FilterBar extends Component {

  constructor() {
    super();
    this.state = {
      type: 'all'
    };
  }

  createButton(type, label) {
    var handler = this.filterRequested.bind(this, type);
    return (
      <Button
        key={type}
        bsStyle="primary"
        active={this.state.type === type}
        onClick={handler}
      >
        {label}
      </Button>
    );
  }

  filterRequested(type, event) {
  }

  filterTextChanged() {
  }

  render() {
    var buttons = _.map(_.keys(mimeTypes.types), (x) => {
      return this.createButton(x, mimeTypes.types[x].label);
    });

    return (
      <Row>
        <Col sm={8}>
          <ButtonGroup bsSize="small">
            {this.createButton('all', 'All')}
            {buttons}
          </ButtonGroup>
        </Col>
        <Col sm={4}>
          <Input
            type="search"
            placeholder="Search Url"
            bsSize="small"
            ref="filterText"
            onChange={this.filterTextChanged.bind(this)}
          />
        </Col>
      </Row>
    );
  }

}
