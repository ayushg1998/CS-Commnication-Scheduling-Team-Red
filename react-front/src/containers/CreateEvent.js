import React, { Component } from 'react';
// import LoaderButton from '../components/LoaderButton';

//React-Bootstrap
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import * as api from '../shared/api';

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
            end: null,
            color: 'Select a Color'
        }
    }

    validateForm() {
        return (
            this.state.title.length > 0 &&
            this.state.start !== null &&
            this.state.end !== null &&
            this.state.color.length > 0
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
            name: this.state.title,
            description: this.state.description,
            start: this.state.start,
            end: this.state.end,
            color: this.state.color,
            image: null,
            groupId: 5//TODO: change this static value later.
        };

        return api.createEvent(eventData)
            .then(() => {
                alert('success');
            })
            .catch(err => {
                console.log(err.message);
                alert('failed');
            });
    }

    resetState = () => {
        this.setState({
            title: "",
            description: "",
            start: null,
            end: null,
            color: 'Select a Color'
        });
    }

    render() {
        return(
            <Form onSubmit={this.handleSubmit} style={{ padding: 1 + 'em' }}>
                <Form.Group controlId="title">
                    <Form.Label>Event Title:</Form.Label>
                    <Form.Control
                        autoFocus
                        type="cwid"
                        value={this.state.title}
                        onChange={this.handleChange}
                    />
                </Form.Group>

                <Form.Group controlId="description">
                    <Form.Label>Event Description:</Form.Label>
                    <textarea  
                        id="description" 
                        cols="30" 
                        rows="10" 
                        className="form-control"
                        value={this.state.description}
                        onChange={this.handleChange}
                    >
                    </textarea>
                </Form.Group>

                <Form.Group controlId="startDate">
                    <Form.Label style={{ paddingRight: 1 + 'em' }}>Select a Start Date:  </Form.Label>
                    <DatePicker
                        selected={this.state.start}
                        onChange={this.handleStartDateChange}
                        showTimeSelect
                        timeFormat= "HH:mm"
                        timeIntervals={15}
                        timeCaption="time"
                        dateFormat="MMMM d, yyyy h:mm aa"
                    />
                </Form.Group>

                <Form.Group controlId="startDate">
                    <Form.Label style={{ paddingRight: 1.3 + 'em' }}>Select a End Date:  </Form.Label>
                    <DatePicker
                        selected={this.state.end}
                        onChange={this.handleEndDateChange}
                        showTimeSelect
                        timeFormat= "HH:mm"
                        timeIntervals={15}
                        timeCaption="time"
                        dateFormat="MMMM d, yyyy h:mm aa"
                    />
                </Form.Group>

                <Form.Group controlId="description">
                    <Form.Label>Color</Form.Label>
                    <select id="color" className="form-control" onChange={this.handleChange}>
                        <option value = ""  defaultValue>Select a Color</option>
                        <option value = "ff0000">Red</option>
                        <option value = "0000ff">Blue</option>
                        <option value = "00ff00">Green</option>
                    </select>
                </Form.Group>

                <Button type="reset" onClick={this.resetState}>
                    Reset
                </Button>

                <Button variant="primary" type="submit">
                    Submit
                </Button>
            </Form>
        );
    }
}
