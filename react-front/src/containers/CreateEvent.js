import React, { Component } from 'react';
// import LoaderButton from '../components/LoaderButton';

//React-Bootstrap
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import * as api from '../shared/api';

import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './CreateEvent.css';
import './Login.css';

export default class CreateEvent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            title: "",
            description: "",
            start: null,
            end: null,
            color: 'Select a Color',
            groups: [],
            groupId: undefined
        }
    }

    componentDidMount() {
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
        return (
            this.state.title.length > 0 &&
            this.state.start !== null &&
            this.state.end !== null &&
            this.state.color.length > 0 &&
            Number.isNumber(this.state.groupId)
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
        const {title, description,
        start, end, color, groupId} = this.state;

        const eventData = {
            name: title,
            description: description,
            start: start,
            end: end,
            color: color,
            image: null,
            groupId: groupId//TODO: change this static value later.
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
            color: 'Select a Color',
            groupId: undefined
        });
    }
        
    handleGroupSelectionChange = e => {
        this.setState({groupId: parseInt(e.target.value)});
    }    

    render() {
        return(
            <div className="bg">
            <Form onSubmit={this.handleSubmit} className="container panel-default">
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

                <Button className="button-padding" variant="primary" type="submit">
                    Submit
                </Button>
            </Form>
            </div>
        );
    }
}
