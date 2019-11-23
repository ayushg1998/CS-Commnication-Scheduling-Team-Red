import * as assert from 'assert';
import ReactDialog from 'react-dialog';
import React, { Component } from 'react';
import 'react-dialog/css/index.css';
import './Dialog.css';

/*
props: {
  title: string (default '')
  onClose: function (default null)
  isResizable: boolean (default false)
  hasCloseIcon: boolean (default true)
  height: number (default 300)
  width: number (default 500)
}
*/
export default class Dialog extends Component {

  get title() {
    return this.props.title || '';
  }

  get isResizable() {
    return this.props.isResizable || false;
  }

  get hasCloseIcon() {
    return this.props.hasCloseIcon || true;
  }

  get height() {
    return this.props.height || 300;
  }

  get width() {
    return this.props.width || 500;
  }


  get onClose() {
    return this.props.onClose || null;
  }

  get children() {
    return this.props.children || '';
  }

  render() {
    return <ReactDialog
        title={this.title}
        isResizable={this.isResizable}
        hasCloseIcon={this.hasCloseIcon}  
        height={this.height}
        width={this.width}
        onClose={this.onClose}

        modal={true}
      >
        <React.Fragment>
          {this.children}
        </React.Fragment>
      </ReactDialog>
  }
}