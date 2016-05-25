/**
 * HAR (HTTP Archive) Viewer
 */

require('fixed-data-table/dist/fixed-data-table.css');

import React, {Component} from 'react';
import _ from 'lodash';
import {Grid, Row, Col, PageHeader, Button, ButtonGroup, Input, Alert} from 'react-bootstrap';

import FilterBar from './FilterBar.jsx';
import HarEntryTable from './HarEntryTable.jsx';
import mimeTypes from '../core/mimeTypes.js';

import harParser from '../core/har-parser.js';


export default class HarViewer extends Component {

  constructor() {
    super();
    this.state = {
      entries: []
    };
  }

  _initialState() {
    return {
      activeHar: null,
      entries: []
    }
  }

  /*
   * The currently selected value in the select box.
   */
  sampleChanged() {
    var selection = this.refs.selector.getDOMNode().value;
    var har = selection
      ? _.find(window.samples, s => s.id === selection).har
      : null;

    if (har) {
      this.setState({
        activeHar: har
      });
    }
    else {
      this.setState(this._initialState());  // reset state
    }
  }

  renderEmptyViewer() {
    return (
      <Grid>
        <Row>
          <Col sm={12}>
            <p></p>
            <Alert bsStyle="warning">
              <strong>No HAR loaded</strong>
            </Alert>
          </Col>
        </Row>
      </Grid>
    )
  }

  renderViewer(har) {
    var pages = harParser.parse(har),
        currentPage = pages[0];
    var entries = currentPage.entries;

    return (
      <Grid>
        <Row>
          <Col sm={12}>
            <HarEntryTable entries={entries} />
          </Col>
        </Row>
      </Grid>
    )
  }

  renderHeader() {

    var options = _.map(window.samples, (s) => {
      return (
        <option key={s.id} value={s.id}>
          {s.label}
        </option>
      );
    });

    return (
      <Grid>

        <Row>
          <Col sm={12}>
            <PageHeader>Har Viewer</PageHeader>
          </Col>
          <Col sm={3} smOffset={9}>
            <div>
              <label className="control-label"></label>
              <select ref="selector" className="form-control" onChange={this.sampleChanged.bind(this)}>
                <option value="">--- </option>
                {options}
                </select>
            </div>
          </Col>
        </Row>

        <Row>
          <Col sm={12}>
            <p>Pie Chart</p>
          </Col>
        </Row>

        <FilterBar />

      </Grid>
    );
  }

  render() {

    var content = this.state.activeHar
      ? this.renderViewer(this.state.activeHar)
      : this.renderEmptyViewer();

    return (
      <div>
        {this.renderHeader()}
        {content}
      </div>
    );

  }

}
