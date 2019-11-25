import assert from 'assert';
import React, { Component } from 'react';
import ReactFileReader from 'react-file-reader';

const DELIMITER = "base64,77u/";

/*
  props:
    onRead: function(result: string) *required
    children: ReactElement *required
*/
export default class CsvReader extends Component {

  constructor(props) {
    super(props);
    assert.ok(props.onRead);
  }

  handleFile = result => {
    const chosen = !!(result && result.base64);
    if (!chosen) return;
    try {
      this.props.onRead(atob(result.base64.split(DELIMITER)[1]));
    } catch(error) {
      alert('error decoding csv');
    }
  }

  render() {
    return (
      <ReactFileReader 
        fileTypes={'.csv'}
        base64={true}
        multipleFiles={false}
        handleFiles={this.handleFile}>
        {this.props.children}
      </ReactFileReader>
      
    )
  }
}

