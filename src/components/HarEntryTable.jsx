/**
 * HAR (HTTP Archive) Entry Table
 */

require('fixed-data-table/dist/fixed-data-table.css');
require('../css/har-entry-table.scss');

import React, {Component, PropTypes} from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';
import d3 from 'd3';

import TimeBar from './TimeBar.jsx';

import FixedDataTable, {Table, Column} from 'fixed-data-table';
const GutterWidth = 30;


export default class HarEntryTable extends Component {

  constructor() {
    super();
    this.state = {
      isColumnResizing: false,
      columnWidths: {
        url: 500,
        size: 100,
        time: 200
      },
      sortDirection: {
        url: null,
        size: null,
        time: null
      },
      tableWidth: 1000,
      tableHeight: 500
    };
  }

  readKey(key, entry) {
    var keyMap = {
      url: 'request.url',
      time: 'time.start'
    };

    key = keyMap[key] || key;
    return _.get(entry, key);
  }

  getEntry(index) {
    return this.props.entries[index];
  }

  onColumnResized(newColumnWidth, dataKey) {
    var columnWidths = this.state.columnWidths;
    columnWidths[dataKey] = newColumnWidth;

    this.setState({
      columnWidths: columnWidths,
      isColumnResizing: false
    });
  }

  // ================================================
  //                Table Resizing
  // ================================================
  componentDidMount() {
    window.addEventListener(
      'resize',
      _.debounce(this.onResize, 50, {leading: true, trailing: true}).bind(this)
    );
    this.onResize;
  }

  onResize() {
    var parent = ReactDOM.findDOMNode(this.refs.entriesTable).parentNode;

    this.setState({
      tableWidth: parent.clientWidth - GutterWidth,
      tableHeight: document.body.clientHeight - parent.offsetTop - GutterWidth * 0.5
    })
  }

  // ================================================
  //          Custom Cell Rendering
  // ================================================
  renderTimeColumn(cellData, cellDataKey, rowData, rowIndex, columnData, width) {
    var start = rowData.time.start,
        total = rowData.time.total,
        pgTimings = this.props.page.pageTimings,
        scale = this.prepareScale(this.props.entries, this.props.page);

    return (
      <TimeBar
        scale={scale}
        start={start}
        total={total}
        timings={rowData.time.details}
        domContentLoad={pgTimings.onContentLoad}
        pageLoad={pgTimings.onLoad}
      />
    )
  }

  prepareScale(entries, page) {
    var startTime = 0,
        lastEntry = _.last(entries),
        endTime = lastEntry.time.start + lastEntry.time.total,
        maxTime = Math.max(endTime, page.pageTimings.onLoad);

    var scale = d3.scale.linear()
      .domain([startTime, Math.ceil(maxTime)])
      .range([0, 100]);

    return scale;
  }

  // ================================================
  //                Table Sorting
  // ================================================
  renderHeader(label, dataKey) {
    var dir = this.state.sortDirection[dataKey],
        classMap = {
          asc: 'glyphicon glyphicon-sort-by-attributes',
          desc: 'glyphicon glyphicon-sort-by-attributes-alt',
        };
    var sortClass = dir ? classMap[dir] : '';

    return (
      <div
        className="text-primary sortable"
        onClick={this.columnClicked.bind(this, dataKey)}
      >
        <strong>{label}</strong>
        &nbsp;
        <i className={sortClass}></i>
      </div>
    );
  }

  columnClicked(dataKey) {
    var sortDirections = this.state.sortDirection,
        dir = sortDirections[dataKey];

    if (dir === null) { dir = 'asc'; }
    else if (dir === 'asc') { dir = 'desc'; }
    else if (dir === 'desc') { dir = null; }

    // Reset all sorts
    _.each(_.keys(sortDirections), function(x) {
      sortDirections[x] = null;
    });
    sortDirections[dataKey] = dir;

    if (this.props.onColumnSort) {
      this.props.onColumnSort(dataKey, dir);
    }
  }


  render() {
    return (
      <Table ref="entriesTable"
             rowsCount={this.props.entries.length}
             width={this.state.tableWidth}
             headerHeight={30}
             height={this.state.tableHeight}
             rowHeight={30}
             rowGetter={this.getEntry.bind(this)}
             isColumnResizing={this.state.isColumnResizing}
             onColumnResizeEndCallback={this.onColumnResized.bind(this)} >
        <Column
          dataKey="url"
          width={this.state.columnWidths.url}
          headerRenderer={this.renderHeader.bind(this)}
          cellDataGetter={this.readKey.bind(this)}
          isResizable={true}
          flewGrow={null}
          label="Url"
        />
        <Column
          dataKey="size"
          width={this.state.columnWidths.size}
          headerRenderer={this.renderHeader.bind(this)}
          cellDataGetter={this.readKey.bind(this)}
          isResizable={true}
          label="Size"
        />
        <Column
          dataKey="time"
          width={this.state.columnWidths.time}
          headerRenderer={this.renderHeader.bind(this)}
          cellRenderer={this.renderTimeColumn.bind(this)}
          cellDataGetter={this.readKey.bind(this)}
          isResizable={true}
          label="Timeline"
        />
      </Table>
    );
  }

}

HarEntryTable.defaultProps = {
  entries: [],
  page: null,
  onColumnSort: null
};

HarEntryTable.propTypes = {
  entries: PropTypes.array,
  page: PropTypes.object,
  onColumnSort: PropTypes.func
};
