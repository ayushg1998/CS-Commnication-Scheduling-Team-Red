import React, { Component } from 'react';
import Calendar from 'react-calendar';
import './Dashboard.css';

class Dashboard extends Component {
    constructor(props) {
        super(props);

        this.state = {
            value: new Date()
        }
    }

    render () {
        return (
            <div className="container">
                <Calendar
                    onChange={this.onChange}
                    showWeekNumbers
                    value={this.state.date}
                />
            </div>
        );
    }
}

export default Dashboard;