import * as assert from 'assert';
import AddController from './controller_add';
import EditController from './controller_edit';
import Repository from './repository';
import View from './view';
import ViewDataMapper from './view_data_mapper';

import React, { Component } from 'react';

const TYPE_EDIT = 'editAppointment';
const TYPE_ADD = 'addAppointment';

/*
  request: 'editAppointment' | 'addAppointment' (required)
  appointmentEventId: number (required)
  appointmentId: number (required only if request === 'editAppointment')
  onClose: (submitted: boolean) => void; submitted parameter is passed true, if the view closes after submission
*/
export default class MakeAppointment extends Component {
  constructor(props) {
    super(props);
    const { request, appointmentEventId, appointmentId } = props;
    assert.ok([TYPE_EDIT, TYPE_ADD].indexOf(request) >= 0); assert.ok(appointmentEventId);

    //BEGIN: initializing controller
    const repository = new Repository();
    const viewDataMapper = new ViewDataMapper();

    if (request === TYPE_ADD) {
      this.controller = new AddController({
        repository, viewDataMapper, 
        appointmentEventId, onFinishListener: this});
    } else {
      assert.ok(appointmentId);
      this.controller = new EditController({
        repository, viewDataMapper, 
        appointmentEventId, appointmentId, 
        onFinishListener: this});
    }
    //END: initializing controller

    this.state = { finished: false };
  }

  onSubmitFinish() {
    this.setState({finished: true}, () => {
      const { onClose } = this.props;
      if (onClose) onClose(true);
    })
  }

  onPrematureFinish() {
    this.setState({finished: true}, () => {
      const { onClose } = this.props;
      if (onClose) onClose(false);
    })
  }

  render() {
    const isFinished = this.state.finished;

    return isFinished? null: 
      (<View
        controller={this.controller} />);
  }
}