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
            events: [],
        };
    }

    eventStyle = (event) => {
        console.log(event);
        const backgroundColor = '#' + event.color;
        const style = { backgroundColor};
        console.log(style);
        return { style,
                };
    }

    componentDidMount(){      
        let getObject = JSON.parse(localStorage.getItem('user'));

        if(getObject.userType === "faculty" || getObject.userType === "admin")
        {
        displayEvents.getCalendarEvents()
            .then(data => {            
                const events = data.events.map(e => ({
                    title: (e.name || 'N/A: ') + `(${e.permission})`,
                    start: new Date(e.start),
                    end: new Date(e.end),
                    color: e.color,
                    type: 'event'
                }));

                console.log(data);

                const appointmentEvents = data.appointmentEvents.map(ape => ({
                    title: (ape.name || 'N/A: ') + `(${ape.permission})`,
                    start: new Date(ape.start),
                    end: new Date(ape.end),
                    color: ape.color,
                    type: 'event'
                }));

                const calendarEvents = [...events,...appointmentEvents];

                console.log(calendarEvents);
                
               this.setState({events: calendarEvents});
            })
            .catch(error => {
                alert(error.message);
            })
        }
        if(getObject.userType === "student")
        {
            displayEvents.getMyAppointments()
                .then(data => {                         
                    console.log(data)     
                    const event = data.map(e => ({
                        title: e.appointmentEventId +" Start: " +new Date(e.start)+" End: "+new Date(e.end),
                        start: new Date(e.start),
                        end: new Date(e.end),
                    }));
                 this.setState({events: event});
                   console.log(this.state.events)
                })
                .catch(error => {
                    alert(error.message);
                })  
        }       
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