import React, { Component } from 'react';
import * as api from '../shared/api';
import Select from 'react-select';

import './Login.css';
import './CreateEvent.css';
//import Card from 'react-ui-cards';
import moment from 'moment';

const NA = "NA";
export default class MakeAppointment extends Component {
    constructor(props) {
        super(props);
        this.state = {
            appointmentEvents: [],
            activeAppointmentEvent: null,
            activeAppointments: [],
            activeAppointer: null,
            hasActiveAppointmentData: false,
            posistion: -1
        };
    }

    componentDidMount(){
        api.getJoinableAppointmentEvents()
            .then(appointmentEvents => {
                this.setState({appointmentEvents});
            })
    }

    handleApEventClick = apeId => {
        api.getAppointmentEventAndItsAppointments(apeId)
            .then(apEvent => {
                let appointments = apEvent.appointments;
                const appointer = apEvent.appointer;
                const {
                    id, description,
                    start, name, color,
                    end, slotInterval, slotCount
                } = apEvent;

                for(let i = 0; i < slotCount; i++) {
                    const doesExist = !!appointments.find(a => a.position === i);
                    if (doesExist) continue;
                    const offsetStart = i * slotInterval;
                    const offsetEnd = offsetStart + slotInterval;

                    appointments.push({
                        start: moment(start).add(offsetStart, 'minutes').toISOString(),
                        end: moment(start).add(offsetEnd, 'minutes').toISOString(),
                        position: i,
                        appointee: { fname: NA, lname: NA },
                        unoccupied: true
                    });
                }

                appointments = appointments.sort((a, b) => a.position - b.position);

                this.setState({
                    activeAppointer: appointer,
                    activeAppointments: appointments,
                    activeAppointmentEvent: {
                        id, description,
                        start, name, color,
                        end, slotInterval, slotCount
                    },
                    hasActiveAppointmentData: true
                });
            });

    }
    appointmentPosition(pos){
              return (
                this.setState({position: pos})
                  ); 
  }

handleSubmit() {

    const appData = {
      position: this.state.position,
      appointmentEventId: this.state.activeAppointmentEvent.id
    };

    api.addAppointment(appData)
        .then(() =>{
            alert("success");                
        })
        .catch(res => {
            if (!res.success) throw new Error(res.message);
            return;
        });       
  };

    appointmentCards()
    {   
        const {activeAppointer, activeAppointments, activeAppointmentEvent, hasActiveAppointmentData} = this.state;
        return(
        hasActiveAppointmentData?
        (
            <div>
                <div>
                    <h2>Appointment Event:</h2>
                <p>Name: {activeAppointmentEvent.name}</p>
                <p>Description: {activeAppointmentEvent.description}</p>
                <p style={{backgroundColor: `#${activeAppointmentEvent.color}`}}>Color: {activeAppointmentEvent.color}</p>
                <p>Start: {activeAppointmentEvent.start}</p>
                <p>End: {activeAppointmentEvent.end}</p>
                <p>Slot Interval: {activeAppointmentEvent.slotInterval}</p>
                <p>Slot Count: {activeAppointmentEvent.slotCount}</p>
                </div>
                <div>
                    <h2>Appointer of this Appointment Event:</h2>
                </div>
                <div>
                    <h2>Appointments that have been registered</h2>
                    <ul>
                        {
                            activeAppointments.map((ap, index) => (
                                <div key={index} className="card" style={{ marginBottom: 3 + 'em' }}>
                            <h5 className="card-header">Appointment Time Slot</h5>
                            <div className="card-body">
                                <ul className="list-group list-group-flush">
                                    <li className="list-group-item">
                                        <h5 className="card-title">Start:</h5>
                                        <p className="card-text">{ap.start}</p>
                                    </li>
                                    <li className="list-group-item">
                                        <h5 className="card-title">End:</h5>
                                        <p className="card-text">{ap.end}</p>
                                    </li>
                                    <li className="list-group-item">
                                        <h5 className="card-title">Position:</h5>
                                        <p className="card-text">{ap.position}</p>
                                    </li>
                                    <li className="list-group-item">
                                        <h5 className="card-title">Appointee:</h5>
                                        <p className="card-text">{ap.appointee? ap.appointee.fname: NA}{ap.appointee? ap.appointee.lname: NA}</p>
                                    </li>
                                </ul>
                                <a 
                                    href="#" 
                                    className="btn btn-primary" 
                                    onClick={() => this.appointmentPosition(ap.position)}
                                    style={{ marginTop: 1 + 'em' }}
                                >Select this appointment slot to sign up</a>
                            </div>
                        </div>
                            ))
                        }
                    </ul>
                </div>
            </div>
                
        ): (
            null
        )
        )
    }
    //TODO: do this
    //then upon click appointment event from list, getSpecificAppointmentEvent api should be called
    //then open a model/dialogue, that shows list of appointments
    render() {
        const apes = this.state.appointmentEvents;
        
        if(this.state.hasActiveAppointmentData === true){
            return(<div>
                
                {this.appointmentCards()}
            <a 
                                href="#" 
                                className="btn btn-primary" 
                                onClick = { () => this.handleSubmit()}
                                style={{ marginTop: 1 + 'em' }}
                            >Submit</a>
            </div>)
        }
        else{
        return (
            <div>
                <div>
                    <ul>
                        {
                            apes.map(ape => <li key={ape.id}>
                                {ape.name} | 
                                {ape.description} | 
                                {ape.start} | 
                                {ape.end}
                                <button onClick={() => this.handleApEventClick(ape.id)}>Click for Appointment</button>
                                </li>)
                        }
                    </ul>
                </div>
            </div>        
        );}
                    }
}
