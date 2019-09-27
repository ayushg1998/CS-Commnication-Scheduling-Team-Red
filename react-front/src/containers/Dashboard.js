import React, { Component } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import axios from 'axios';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './Dashboard.css';

moment.locale('en-GB');
const localizer = momentLocalizer(moment);

class Dashboard extends Component {
    constructor(props) {
        super(props);

        const now = new Date();
        const events = [
        {
            id: 0,
            title: 'All Day Event very long title',
            allDay: true,
            start: new Date(2019, 6, 0),
            end: new Date(2019, 6, 1),
        },
        {
            id: 1,
            title: 'Long Event',
            start: new Date(2019, 3, 7),
            end: new Date(2019, 3, 10),
        },
        {
            id: 2,
            title: 'Right now Time Event',
            start: now,
            end: now,
        },
        ]
        this.state = {
            events
        };
    }

    render () {
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