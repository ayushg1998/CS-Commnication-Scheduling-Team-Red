import React, { Component } from 'react';
import * as api from '../shared/api';
import Select from 'react-select';

import './Login.css';
import './CreateEvent.css';
//import Card from 'react-ui-cards';

export default class MakeAppointment extends Component {
    constructor(props) {
        super(props);
        this.state = {
            appointmentEvents: []
        };
    }

    componentDidMount(){
        api.getJoinableAppointmentEvents()
            .then(appointmentEvents => {
                this.setState({appointmentEvents});
            })
    }

    //TODO: do this
    //then upon click appointment event from list, getSpecificAppointmentEvent api should be called
    //then open a model/dialogue, that shows list of appointments
    render() {
        const apes = this.state.appointmentEvents;

        return <ul>
            {
                apes.map(ape => <li key={ape.id}>{ape.name} | {ape.description} | {ape.start} | {ape.end}</li>)
            }
        </ul>
    }
}
