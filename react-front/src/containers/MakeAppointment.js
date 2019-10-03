import React, { Component } from 'react';
import {
    FormGroup,
    FormControl,
    ControlLabel
} from 'react-bootstrap';

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
            <form onSubmit={this.handleSubmit}>
                

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

                <FormGroup controlId="searchFaculty" bsSize="large">
                    <ControlLabel>Search Faculty</ControlLabel>
                    <FormControl
                        autoFocus
                        type="id"
                        value={this.state.title}
                        onChange={this.handleChange}
                    />
                </FormGroup>
                <button type="submit" className="btn btn-primary">
                    Submit
                </button>
            </form>
        );
    }
}
