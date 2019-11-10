import React, { Component } from 'react';

//React-Bootstrap
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import * as api from '../shared/api';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './CreateEvent.css';
import * as appointmentEventService from '../shared/appointmentEventService'
//import moment from 'moment';
import Select from 'react-select';

export default class Appointment extends Component {
    constructor(props) {
        super(props);
        this.state = {
            title: '',
            slotInterval: 1,
            description: '',
            start: null,
            end: null, 
            color: 'ff0000',
            selectedOption: ''
        }
    }

    componentDidMount(){
        //change this to getEmail api
        api.getFaculty()
            .then(res => {
                let objectApp = [];
                console.log(res.faculties.length);

                for(let i =0; i<res.faculties.length; i++){
                    const fac = res.faculties[i];

                    objectApp.push({
                        label: fac.fname + " " + fac.lname,
                        value: fac.lname,
                        id: fac.id
                    });
                }

                console.log("This is objectApp: " + objectApp);

                this.setState({faculty:objectApp});
                console.log(this.state.faculty);
                return res;
            })
    }

    validateForm() {
        return (
            this.state.title.length > 0 &&
            this.state.slotInterval > 0 &&
            this.state.start !== null &&
            this.state.end !== null &&
            this.state.color.length >0 &&
            this.state.selectedOption.Length> 0
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
        console.log(this.state.title);
        event.preventDefault();
        if (!this.validateForm()) {
            alert('invalid form'); return;
        }

        appointmentEventService.addAppointmentEvent({
            name: this.state.title,
            slotInterval: this.state.slotInterval,
            description: this.state.description,
            start: this.state.start,
            end: this.state.end,
            color: this.state.color
            //selectedOption: this.state.selectedOption
        })
            .then(result => {
                alert('success');
                console.log(this.state.title);
                this.resetState();
            })
            .catch(error => {
                alert(`errored: ${error.message}`);
            });        
    }

    handleOptionChange = selectedOption => {
        this.setState({
            selectedOption
        });
    }

    resetState = () => {
        this.setState({
            title: '',
            slotInterval: 1,
            description: '',
            start: null,
            end: null,
            color: 'ff0000'
        });
    }

    render() {
        return(
            <Form onSubmit={this.handleSubmit} style={{ padding: 1 + 'em' }}>
                
                <Form.Group controlId="startDate">
                    <Form.Label style={{ paddingRight: 1 + 'em' }}>Title:  </Form.Label>
                    <input type="text"  
                        id="title" 
                        cols="10"
                        className="form-control"
                        value={this.state.title}
                        onChange={this.handleChange}
                    />                    
                </Form.Group>
                
                <Form.Group controlId="startDate">
                    <Form.Label style={{ paddingRight: 1 + 'em' }}>Select a Start Date:  </Form.Label>
                    <DatePicker
                        selected={this.state.start}
                        onChange={this.handleStartDateChange}
                        showTimeSelect
                        timeFormat= "HH:mm"
                        timeIntervals={5}
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
                        timeIntervals={5}
                        timeCaption="time"
                        dateFormat="MMMM d, yyyy h:mm aa"
                    />
                </Form.Group>

                <Form.Group controlId="slotInterval">
                    <Form.Label>Slot Duration (In Minutes): </Form.Label>
                    <Form.Control
                        autoFocus
                        type="number"
                        value={this.state.slotInterval}
                        onChange={this.handleChange}
                    />
                </Form.Group>
                <Form.Group controlId="description">
                    <Form.Label>Color</Form.Label>
                    <select id="color" className="form-control" value={this.state.color} onChange={this.handleChange}>
                        <option value = "ff0000">Red</option>
                        <option value = "0000ff">Blue</option>
                        <option value = "00ff00">Green</option>
                    </select>
                </Form.Group>


                <Form.Group controlId="description">
                    <Form.Label>Appointment Description:</Form.Label>
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

            <div>
                <header className="App-header">
                    <h3 className="App-title">What groups time slots are exclusive too. need to change from faculty to groups!!!</h3> 
                </header>
            <Select
                name="form-field-name"
                value={this.state.value}
                isMulti
                onChange={this.handleOptionChange}
                clearable={this.state.clearable}
                searchable={this.state.searchable}
                labelKey='name'
                valueKey='last name'                
                options={this.state.faculty} 
            />
            </div>
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
