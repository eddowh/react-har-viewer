/**
 * HAR (HTTP Archive) Viewer
 */

require('fixed-data-table/dist/fixed-data-table.css');

import React, {Component} from 'react';
import _ from 'lodash';
import {Grid, Row, Col, PageHeader, Button, ButtonGroup, Input, Alert} from 'react-bootstrap';

import FilterBar from './FilterBar.jsx';
import HarEntryTable from './HarEntryTable.jsx';
import SampleSelector from './SampleSelector.jsx';
import mimeTypes from '../core/mimeTypes.js';

import harParser from '../core/har-parser.js';


export default class HarViewer extends Component {

  constructor() {
    super();
    this.state = this._initialState();
  }

  _initialState() {
    return {
      // activeHar: null,
      activeHar: _.find(window.samples, s => s.id == 'so').har,
      filterType: 'all',
      filterText: null,
      sortKey: null,
      sortDirection: null,
      // entries: []
    }
  }

  sampleChanged(har) {
    if (har) {
      this.setState({
        activeHar: har
      });
    }
    else {
      this.setState(this._initialState());  // reset state
    }
  }


  // ================================================
  //                   Filtering
  // ================================================
  onFilterChanged(type) {
    this.setState({
      filterType: type
    });
  }

  onFilterTextChanged(text) {
    this.setState({
      filterText: text
    });
  }

  filterEntries(filter, entries) {
    return _.filter(entries, function(x) {
      var matchesType = filter.type === 'all' || filter.type === x.type,
          matchesText = _.includes(x.request.url, filter.text || '');

      return matchesType && matchesText;
    });
  }

  // ================================================
  //                   Sorting
  // ================================================
  onColumnSort(dataKey, direction) {
    this.setState({
      sortKey: dataKey,
      sortDirection: direction
    });
  }

  sortEntriesByKey(sortKey, sortDirection, entries) {
    if (_.isEmpty(sortKey) | _.isEmpty(sortDirection)) return entries;

    var keyMap = {
      url: 'request.url',
      time: 'time.start'
    };

    var getValue = function(entry) {
      var key = keyMap[sortKey] || sortKey;
      return _.get(entry, key);
    };

    var sorted = _.sortBy(entries, getValue);
    if (sortDirection === 'desc') {
      sorted.reverse()
    };

    return sorted;
  }


  // ================================================
  //                  Rendering
  // ================================================
  renderHeader() {

    return (
      <Grid>

        <Row>
          <Col sm={12}>
            <PageHeader>Har Viewer</PageHeader>
          </Col>
          <Col sm={3} smOffset={9}>
            <SampleSelector onSampleChanged={this.sampleChanged.bind(this)} />
          </Col>
        </Row>

        <Row>
          <Col sm={12}>
            <p>Pie Chart</p>
          </Col>
        </Row>


      </Grid>
    );
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

    var filter = {
      type: this.state.filterType,
      text: this.state.filterText
    }
    var filteredEntries = this.filterEntries(filter, currentPage.entries);

    var entries = this.sortEntriesByKey(
      this.state.sortKey,
      this.state.sortDirection,
      filteredEntries
    );

    return (
      <Grid>

        <FilterBar
          onChange={this.onFilterChanged.bind(this)}
          onFilterTextChange={this.onFilterTextChanged.bind(this)}
        />

        <Row>
          <Col sm={12}>
            <HarEntryTable
              entries={entries}
              page={currentPage}
              onColumnSort={this.onColumnSort.bind(this)}
            />
          </Col>
        </Row>

      </Grid>
    )
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
