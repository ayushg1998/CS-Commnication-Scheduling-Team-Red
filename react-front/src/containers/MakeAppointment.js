import React, { Component } from 'react';

//React-Bootstrap
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

import 'react-datepicker/dist/react-datepicker.css';
import './CreateEvent.css';
export default class MakeAppointment extends Component {
    constructor(props) {
        super(props);
        this.state = {
            title: "",
            description: "",
        }
    }

    validateForm() {
        return (
            this.state.title.length > 0
        );
    }

    handleChange = event => {
        this.setState({
            [event.target.id]: event.target.value
        });
    }


    

    handleSubmit = event => {
        event.preventDefault();

        const appointmentData = {
            title: this.state.title,
            description: this.state.description
        };

        console.log(appointmentData);
    }

    render() {
        return(
            <Form onSubmit={this.handleSubmit} style={{ padding: 1 + 'em' }}>
                <Form.Group controlId="title">
                    <Form.Label>Search Faculty</Form.Label>
                    <Form.Control
                        autoFocus
                        type="id"
                        value={this.state.title}
                        onChange={this.handleChange}
                    />
                </Form.Group>
                <Button type="submit" variant="primary">
                    Submit
                </Button>
            </Form>
        );
    }
}
