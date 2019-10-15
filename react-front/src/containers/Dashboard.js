import React, { Component } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './Dashboard.css';
import * as displayEvents from '../shared/api';

moment.locale('en-GB');
const localizer = momentLocalizer(moment);

class Dashboard extends Component {
    constructor(props) {
        super(props);

        this.state = {
            events: []
        };
    }

    componentDidMount(){
        let appointments = (displayEvents.getAppointmentEvent())
        
        appointments.then(res => {
            
            let objectApp = [{}];
            console.log(res.appointmentEvents.length)

            for(let i =0; i<res.appointmentEvents.length; i++){
                objectApp.push({
                    title: res.appointmentEvents[i].name,
                    start: new Date(res.appointmentEvents[i].start),
                    end: new Date(res.appointmentEvents[i].end)
                });
            }
            console.log(objectApp);

            this.setState({events: objectApp});
            return res;
        })
    }

    render () {
        console.log(moment().toDate());
        return (
            <div className="container">
                <header className="App-header">
                    <h1 className="App-title">Calendar</h1>
                </header>
                <div style={{ height: '500pt' }}>
                    <Calendar
                        localizer={localizer}
                        events={this.state.events}
                        startAccessor="start"
                        endAccessor="end"
                        defaultDate={moment().toDate()}
                    />
                </div>
            </div>
        );
    }
}

export default Dashboard;