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
            events: [{
                id: 0,
                title: 'All Day Event very long title',
                allDay: false,
                start: moment('2019-10-06T08:00').toDate(),
                end: moment('2019-10-06T18:00').toDate(),
            }]
        };
    }


    // componentDidMount(){
    //     let appointments = displayEvents.getAppointmentEvent();
    //     console.log(appointments);
    //     console.log("??");
    //     // for (let i = 0; i < appointments.length; i++) {
    //     //     appointments[i].start = moment(appointments[i].start).toDate();
    //     //     appointments[i].end = moment(appointments[i].end).toDate();
            
    //     //   }
    //     console.log(displayEvents.getAppointmentEvent());
    //     console.log(appointments.length);
    //     //this.setState({events:appointments});
    // }


    // componentWillMount(){
    //     let appointments = (displayEvents.getAppointmentEvent())
    //     appointments.start = moment.utc(appointments.start).toDate();
    //     appointments.end = moment.utc(appointments.end).toDate();
    //     appointments.then(res => {
    //         console.log(appointments.start);            
    //         console.log(appointments.end);
    //         console.log(res);
    //     })
    // }

    componentDidMount(){
        let appointments = (displayEvents.getAppointmentEvent())
        
        appointments.then(res => {
            //appointments.start = moment(appointments.start).toDate();
            console.log(appointments.start);            
            console.log(appointments.end);
            console.log(res);
            console.log(appointments);
            this.setState({events: res.appointmentEvents});
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