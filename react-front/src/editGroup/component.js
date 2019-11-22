import React, { Component } from 'react';
import Controller from './controller';
import View from './view';
import Repository from './repository';


/*this class wraps repository into controller and controller into view.
  Basically, a neat way of initialization*/
export default class EditGroupComponent extends Component {
  constructor(props) {
    super(props);
    this.controller = new Controller({repository: new Repository()});
  }

  render() {
    return <View controller={this.controller} />
  }
}