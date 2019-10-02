import React, { Component } from 'react';
import {
    FormGroup,
    FormControl,
    ControlLabel
} from 'react-bootstrap';

import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './CreateEvent.css';

export default class Appointment extends Component {
    constructor(props) {
        super(props);
        this.state = {
            title: "",
            description: "",
            start: null,
            end: null
        }
    }

    validateForm() {
        return (
            this.state.title.length > 0 &&
            this.state.start !== null &&
            this.state.end !== null
        );
    }

    handleChange = event => {
        this.setState({
            [event.target.id]: event.target.value
        });
    }

    handleStartDateChange= date => {
        this.setState({
            start: date
        });
    }

    handleEndDateChange= date => {
        this.setState({
            end: date
        });
    }

    handleSubmit = event => {
        event.preventDefault();

        const appointmentData = {
            title: this.state.title,
            description: this.state.description,
            start: this.state.start,
            end: this.state.end
        };

        console.log(appointmentData);
    }

    render() {
        return(
            <form onSubmit={this.handleSubmit}>
                <FormGroup controlId="startDate">
                    <ControlLabel style={{ paddingRight: 1 + 'em' }}>Select a Start Date:  </ControlLabel>
                    <DatePicker
                        selected={this.state.start}
                        onChange={this.handleStartDateChange}
                        showTimeSelect
                        timeFormat= "HH:mm"
                        timeIntervals={15}
                        timeCaption="time"
                        dateFormat="MMMM d, yyyy h:mm aa"
                    />
                </FormGroup>

                <FormGroup controlId="startDate">
                    <ControlLabel style={{ paddingRight: 1.3 + 'em' }}>Select a End Date:  </ControlLabel>
                    <DatePicker
                        selected={this.state.end}
                        onChange={this.handleEndDateChange}
                        showTimeSelect
                        timeFormat= "HH:mm"
                        timeIntervals={15}
                        timeCaption="time"
                        dateFormat="MMMM d, yyyy h:mm aa"
                    />
                </FormGroup>

                <FormGroup controlId="title" bsSize="large">
                    <ControlLabel>Interval-Slots</ControlLabel>
                    <FormControl
                        autoFocus
                        type="id"
                        value={this.state.title}
                        onChange={this.handleChange}
                    />
                </FormGroup>

                <FormGroup controlId="description" bsSize="large">
                    <ControlLabel>Appointment Description:</ControlLabel>
                    <textarea  
                        id="description" 
                        cols="30" 
                        rows="10" 
                        className="form-control"
                        value={this.state.description}
                        onChange={this.handleChange}
                    >
                    </textarea>
                </FormGroup>

                <button type="submit" className="btn btn-primary">
                    Submit
                </button>
            </form>
        );
    }
}
