import React, { Component } from 'react';
// import LoaderButton from '../components/LoaderButton';

//React-Bootstrap
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

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

                <Button variant="primary" type="submit">
                    Submit
                </Button>
            </Form>
        );
    }
}