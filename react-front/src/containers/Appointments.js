import React, { Component } from 'react';

//React-Bootstrap
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import * as api from '../shared/api';
import DatePicker from 'react-datepicker';

import 'react-datepicker/dist/react-datepicker.css';
import './CreateEvent.css';
import './Login.css';

export default class Appointment extends Component {
    constructor(props) {
        super(props);
        this.state = {
            title: '',
            slotCount: 1,
            slotInterval: 1,
            description: '',
            start: null,
            color: 'ff0000',
            groupId: undefined,
            groups: []
        }
    }

    componentDidMount(){
        //changed this from faculty to groups
        
        api.getAllVisibleGroups()
            .then(groups_ => {
                //groups with UPDATE permission
                //only concerned with name and id
                const groups = groups_.filter(g => g.permission === 'UPDATE')
                    .map(g => ({id:g.id, label: g.name}));
                
                this.setState({groups: groups});
            });    
    }

    validateForm() {
        const { title, slotCount, slotInterval, description, start, color, groupId } = this.state;
        //double !! turns into boolean
        return !!(
            title && slotCount &&
            slotInterval && description &&
            start && color && groupId
        );
    }

    handleChange = event => {
        this.setState({
            [event.target.id]: event.target.value
        });
    }

    handleSlotIntervalChange = e => {
        this.setState({slotInterval: parseInt(e.target.value)});
    }

    handleSlotCountChange = e => {
        this.setState({slotCount: parseInt(e.target.value)});
    }

    handleStartDateChange= date => {
        this.setState({start: date});
    }

    handleGroupSelectionChange = e => {
        this.setState({groupId: parseInt(e.target.value)});
    }

    handleSubmit = event => {
        event.preventDefault();
        if (!this.validateForm()) {
            alert('Invalid Form'); return;
        }
        
        const {start, slotCount, slotInterval, description, title, color, groupId} = this.state;

        api.addAppointmentEvent({
            name: title,
            start, slotCount,
            slotInterval, description,
            color, groupId
        })
            .then(result => {
                alert('The appointment slots have been successfully created');
                this.resetState();
            })
            .catch(error => {
                alert(`The appointment slots could not be created. ${error.message}`);
            });        
    }

    resetState = () => {
        this.setState({
            title: '',
            slotCount: 1,
            slotInterval: 1,
            description: '',
            start: null,
            color: 'ff0000',
            groupId: undefined
        });
    }

    render() {
        return(
            <div>
            <Form onSubmit={this.handleSubmit} className="container panel-default">
                
                <Form.Group controlId="startDate">
                    <Form.Label style={{ paddingRight: 1 + 'em' }}>Title:  </Form.Label>
                    <input type="text"  
                        id="title" 
                        cols="10"
                        placeholder="Title"
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
                        placeholderText=" Start Date and Time"
                        timeCaption="time"
                        dateFormat="MMMM d, yyyy h:mm aa"
                    />
                </Form.Group>

                <Form.Group controlId="slotInterval">
                    <Form.Label>Slot Duration (In Minutes): </Form.Label>
                    <Form.Control
                        autoFocus
                        type="number"
                        placeholder="Duration of each slot"
                        value={this.state.slotInterval}
                        onChange={this.handleSlotIntervalChange}
                    />
                </Form.Group>
                <Form.Group controlId="slotCount">
                    <Form.Label>Slot Count: </Form.Label>
                    <Form.Control
                        autoFocus
                        type="number"
                        value={this.state.slotCount}
                        placeholder="Total number of slots"
                        onChange={this.handleSlotCountChange}
                    />
                </Form.Group>
                <Form.Group controlId="color">
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

                <Form.Group controlId="groupId">
                    <Form.Label>What group be assigned</Form.Label>
                    <select id="groupId" className="form-control" 
                        value={this.state.groupId}
                        onChange={this.handleGroupSelectionChange}>
                        <option value={undefined}>Select Group...</option>
                        {  
                            this.state.groups.map(g => (
                                <option value={g.id} key={g.id}>{g.label}</option>
                            ))
                        }
                    </select>
                </Form.Group>

                <Button type="reset" onClick={this.resetState} style={{ marginTop: 0.5 + 'em'}}>
                    Reset
                </Button>
                <Button className="button-padding" variant="primary" type="submit" style={{ marginTop: 0.5 + 'em'}}>
                    Submit
                </Button>
            </Form>
            </div>
        );
    }
}
