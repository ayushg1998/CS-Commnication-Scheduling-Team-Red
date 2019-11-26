import React, { Component } from 'react';
import * as api from '../shared/api';
import MakeAppointment from '../makeAppointment';

import './Login.css';
import './CreateEvent.css';
import Button from "react-bootstrap/Button";

//import Card from 'react-ui-cards';
import moment from 'moment';

const NA = "NA";
export default class SignupForAppointment extends Component {
    constructor(props) {
        super(props);

        //each element in editableAppointmentEvent would also have appointmentId field attached
        this.state = {
            editableAppointmentEvent: [],
            addableAppointmentEvent: [],

        };
    }

    componentDidMount(){
        this.requestAndFill();
    }

    requestAndFill() {
        const editableAppointmentEvent = [], addableAppointmentEvent = [];

        api.getJoinableAppointmentEvents()
            .then(appointmentEvents => {
                
                api.getMyAppointments()
                    .then(appointments => {
                        const editableAppointmentEventIds = appointments.map(ap => ap.appointmentEventId);

                        appointmentEvents.forEach(ape => {
                            const isEditable = editableAppointmentEventIds.indexOf(ape.id) >= 0;
                            if (isEditable) {
                                //BEGIN: attaching appointmentId
                                const appointmentId = appointments.find(ap => ap.appointmentEventId === ape.id).id;
                                ape.appointmentId = appointmentId;
                                //END: attaching appointmentId
                                editableAppointmentEvent.push(ape);
                            }
                            else addableAppointmentEvent.push(ape);

                            this.setState({editableAppointmentEvent, addableAppointmentEvent});
                        });
                    })

            })
    }

    handleApeEventClicked = (appointmentEventId, appointmentId) => {
        const isAddable = !appointmentId;
        this.setState({
            openMakeAppointmentDialog: true, 
            appointmentEventId, 
            appointmentId, 
            isAddable
        });
    }

    handleDialogClose = madeChanges => {
        this.setState({
            openMakeAppointmentDialog: false, 
            appointmentEventId: null, 
            appointmentId: null, 
            isAddable: false
        }, () => {
            if (madeChanges) {
                this.requestAndFill();
            }
        });
    }

    render() {
        const {editableAppointmentEvent, addableAppointmentEvent} = this.state;

        const {openMakeAppointmentDialog, appointmentEventId, appointmentId, isAddable} = this.state;
        return (
            <div className="bg">
            <div className="container panel-default">
                <div>
                    <h2>Edit Appointments</h2>
                    <ul>
                        {
                            editableAppointmentEvent.map(ape => <li key={ape.id}>
                                <li>{ape.name}</li>
                                <ul>
                                    <li>Description: {ape.description}</li>
                                    <li>Start: {ape.start}</li>
                                    <li>End: {ape.end}</li>
                                </ul>
                                <Button 
                                    style={{ marginTop: 0.5 + 'em' }}
                                    variant="primary" 
                                    onClick={() => this.handleApeEventClicked(ape.id, ape.appointmentId)}
                                >
                                    Edit Appointment
                                </Button>
                            </li>)
                        }
                    </ul>
                </div>

                <div>
                    <h2>Add Appointments</h2>
                    <ul>
                        {
                            addableAppointmentEvent.map(ape => <li key={ape.id}>
                                <li>{ape.name}</li>
                                <ul>
                                    <li>Description: {ape.description}</li>
                                    <li>Start: {ape.start}</li>
                                    <li>End: {ape.end}</li>
                                </ul>
                                <Button 
                                    style={{ marginTop: 0.5 + 'em' }}
                                    variant="primary" 
                                    onClick={() => this.handleApeEventClicked(ape.id)}
                                >
                                    Add Appointment
                                </Button>
                            </li>)
                        }
                    </ul>
                </div>

                {
                    openMakeAppointmentDialog? 
                    (
                        <div>
                            <MakeAppointment
                                request={isAddable? 'addAppointment': 'editAppointment'}
                                onClose={this.handleDialogClose}
                                appointmentEventId={appointmentEventId}
                                appointmentId={appointmentId} />
                        </div> 
                    ): null
                }
            </div>    
            </div>    
        );
    }
}
