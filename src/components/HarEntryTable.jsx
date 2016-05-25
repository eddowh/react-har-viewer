/**
 * HAR (HTTP Archive) Entry Table
 */

require('fixed-data-table/dist/fixed-data-table.css');

import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';

import FixedDataTable, {Table, Column} from 'fixed-data-table';
const GutterWidth = 30;


class HarEntryTable extends Component {

  constructor() {
    super();
    this.state = {
      isColumnResizing: false,
      columnWidths: {
        url: 500,
        size: 100,
        time: 200
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
          cellDataGetter={this.readKey.bind(this)}
          isResizable={true}
          flewGrow={null}
          label="Url"
        />
        <Column
          dataKey="size"
          width={this.state.columnWidths.size}
          cellDataGetter={this.readKey.bind(this)}
          isResizable={true}
          label="Size"
        />
        <Column
          dataKey="time"
          width={this.state.columnWidths.time}
          cellDataGetter={this.readKey.bind(this)}
          isResizable={true}
          label="Timeline"
        />
      </Table>
    );
  }

}

HarEntryTable.defaultProps = {
  entries: []
};


export default HarEntryTable;
