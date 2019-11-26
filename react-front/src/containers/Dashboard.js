import React, { Component } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './Dashboard.css';
import * as displayEvents from '../shared/api';
import * as DateUtils from '../shared/dateUtils';

moment.locale('en-GB');
const localizer = momentLocalizer(moment);

const titlify = e => (e.name || 'N/A') + ' ' +  DateUtils.format_h(e.start) + 
    ' - ' + DateUtils.format_h(e.end) + ` (${e.permission}) `;

class Dashboard extends Component {
    constructor(props) {
        super(props);

        this.state = {
            events: [],
        };
    }

    eventStyle = (event) => {
        console.log(event);
        const backgroundColor = '#' + event.color;
        const style = { backgroundColor};
        console.log(style);
        return { style};
    }

    componentDidMount(){     
        displayEvents.getCalendarEvents()
            .then(data => {
                if (data.type === 'faculty') {
                    const events = data.events.map(e => ({
                        title: titlify(e),
                        start: new Date(e.start),
                        end: new Date(e.end),
                        color: e.color,
                        type: 'event'
                    }));
    
                    const appointmentEvents = data.appointmentEvents.map(ape => ({
                        title: titlify(ape),
                        start: new Date(ape.start),
                        end: new Date(ape.end),
                        color: ape.color,
                        type: 'event'
                    }));

                    const calendarEvents = [...events,...appointmentEvents];
                    this.setState({events: calendarEvents});
                } else {
                    const events = data.events.map(e => ({
                        title: titlify(e),
                        start: new Date(e.start),
                        end: new Date(e.end),
                        color: e.color,
                        type: 'event'
                    }));

                    const appointments = data.appointments.map(ap => ({
                        title: "Appointment",
                        start: new Date(ap.start),
                        end: new Date(ap.end),
                        color: ap.color,
                        type: 'event'
                    }));
                    
                    const calendarEvents = [...events,...appointments];
                    this.setState({events: calendarEvents});
                }
            })
            .catch(error => {
                alert(error.message);
            });
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
                        eventPropGetter={(this.eventStyle)}
                    />
                </div>
            </div>
        );
    }
}

export default Dashboard;
