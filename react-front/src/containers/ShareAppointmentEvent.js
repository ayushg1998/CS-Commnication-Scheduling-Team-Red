import React, { Component } from 'react';
import * as api from '../shared/api';
import Select from 'react-select';

import Button from 'react-bootstrap/Button';

const PERMISSION_OPTIONS_READ = [
    {label: 'View only', value: 'READ'}
];

const PERMISSION_OPTIONS_JOIN = [
    {label: 'Join/View', value: 'JOIN'},
    {label: 'View only', value: 'READ'}
];

const PERMISSION_OPTIONS_UPDATE = [
    {label: 'Edit/View', value: 'UPDATE'},
    {label: 'View only', value: 'READ'}
];

const PERMISSION_OPTIONS_UPDATE_JOIN = [
    {label: 'Edit/Join/View', value: 'UPDATE+JOIN'},
    {label: 'Edit/View', value: 'UPDATE'},
    {label: 'Join/View', value: 'JOIN'},
    {label: 'View only', value: 'READ'}
];


export default class ShareAppointmentEvent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            appointmentEvents: [],
            permissions: [],
            faculties: [],
            selectedAppointmentEvent: null,
            selectedPermission: null,
            selectedFaculty: null
        }
    }

    componentDidMount() {
        api.getFaculties().then(faculties => {

            faculties = faculties.map(f => ({
                label: f.fname + ' ' + f.lname,
                value: f.id,
            }));

            api.getAllVisibleAppointmentEvents().then(appointmentEvents => {
                appointmentEvents = appointmentEvents.map(e => ({
                    label: e.name,
                    value: e.id,
                    permission: e.permission
                }));

                this.setState({faculties, appointmentEvents, permissions: [] });
            })
        })
    }

    share = () => {
        const { selectedAppointmentEvent, selectedPermission, selectedFaculty } = this.state;
        if (!selectedAppointmentEvent) { alert('Please select appointmentEvent'); return; }
        if (!selectedPermission) { alert('Please select permission'); return; }
        if (!selectedFaculty) { alert('Please select faculty'); return; }

        api.shareAppointmentEvent({
            appointmentEventId: selectedAppointmentEvent.value,
            userId: selectedFaculty.value,
            permission: selectedPermission.value
        })
            .then(() => {
                alert('success');
            })
            .catch(err => {
                alert(err.message);
            });
    }

    handleAppointmentEventSelectionChange = selectedAppointmentEvent => {
      const p = selectedAppointmentEvent? selectedAppointmentEvent.permission: null;
      let permissions;
      switch(p) {
        case 'JOIN': {
          permissions = PERMISSION_OPTIONS_JOIN;       
        } break;
        case 'UPDATE': {
          permissions = PERMISSION_OPTIONS_UPDATE;
        } break;
        case 'UPDATE+JOIN': {
          permissions = PERMISSION_OPTIONS_UPDATE_JOIN;
        } break;
        default: {
          permissions = PERMISSION_OPTIONS_READ;
        }
      }

      this.setState({selectedAppointmentEvent, permissions, selectedPermission: null});
    }

    handlePermissionSelectionChange = selectedPermission => {
        this.setState({selectedPermission});
    }

    handleFacultySelectionChange = selectedFaculty => {
        this.setState({selectedFaculty});
    }

    render() {
        //console.log(this.state.faculty);
        return(
            <div className="bg">
                <div className="container panel-default">
                    <header className="App-header">
                            <h3 className="App-title">Share Appointment Event</h3>
                    </header>
                        
                    <div>
                        <h4>Select Appointment Event</h4>
                        <Select
                            onChange={this.handleAppointmentEventSelectionChange}
                            value={this.state.selectedAppointmentEvent}
                            options={this.state.appointmentEvents}
                        />
                    </div>

                    <div>
                        <h4>Select Permission</h4>
                        <Select
                            onChange={this.handlePermissionSelectionChange}
                            value={this.state.selectedPermission}
                            options={this.state.permissions}
                        />
                    </div>

                    <div>
                        <h4>Select Faculty</h4>
                        <Select
                            onChange={this.handleFacultySelectionChange}
                            value={this.state.selectedFaculty}
                            options={this.state.faculties} 
                        />
                    </div>

                    <Button style={{ marginTop: 0.5 + 'em' }} variant="primary" type="submit" onClick={this.share}>
                        Share
                    </Button>
                </div>   
            </div> 
        );
    }
}