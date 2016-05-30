// React
import React, {Component} from 'react';

// Stylesheets
require('../css/file-type.scss');


export default class FileType extends Component {

  constructor() {
    super();
    this.state = {};
  }

  render() {
    var type = this.props.type;

    return (
      <div className="fileType">
        <span className={"fileType-type " + type}>{type}</span>
        <span className="fileType-url">{this.props.url}</span>
      </div>
    );
  }

};

FileType.defaultProps = {
  url: null,
  type: null
};
FileType.defaultProps = {};

