import React, { Component } from 'react';
import LoaderButton from '../components/LoaderButton';
import {
    HelpBlock,
    FormGroup,
    FormControl,
    ControlLabel
} from 'react-bootstrap';

import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './CreateEvent.css';

export default class CreateEvent extends Component {
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

        const eventData = {
            title: this.state.title,
            description: this.state.description,
            start: this.state.start,
            end: this.state.end
        };

        console.log(eventData);

        // Uncomment the following code when the api is available

        // createEvent(eventData).then(res => {
        //     console.log(this.props);
        //     if(res) {
        //         console.log("Created Event");
        //         console.log(res);
        //     }
        // });
    }

    render() {
        return(
            <form onSubmit={this.handleSubmit}>
                <FormGroup controlId="title" bsSize="large">
                    <ControlLabel>Event Title</ControlLabel>
                    <FormControl
                        autoFocus
                        type="cwid"
                        value={this.state.title}
                        onChange={this.handleChange}
                    />
                </FormGroup>

                <FormGroup controlId="description" bsSize="large">
                    <ControlLabel>Event Title</ControlLabel>
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

                <FormGroup controlId="startDate">
                    <ControlLabel>Select a Start Date</ControlLabel>
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
                    <ControlLabel>Select a End Date</ControlLabel>
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

                <button type="submit" className="btn btn-primary">
                    Submit
                </button>
            </form>
        );
    }
}