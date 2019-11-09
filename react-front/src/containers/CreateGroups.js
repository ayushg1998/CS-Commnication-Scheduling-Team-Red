import React, { Component } from 'react';
import * as api from '../shared/api';
import Select from 'react-select';
import './ShareCalendar.css';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

export default class CreateGroups extends Component {
    constructor(props) {
        super(props);
        this.state = {
            groupName: "",
            selectedOption: '',
            clearable: true,    
            faculty: [],
            description: ""
        }
    }

    validateForm() {
        return (
            this.state.groupName.length > 0 &&
            this.state.selectedOption.Length> 0
        );
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

    handleSubmit = event => {
        event.preventDefault();

        const eventData = {
            name: this.state.groupName,
            selectedOption: this.state.selectedOption,
            description: this.state.description,
        };

        /*return api.createGroup(eventData)
            .then(() => {
                alert('success');
            })
            .catch(err => {
                console.log(err.message);
                alert('failed');
            });*/
    }

    handleOptionChange = selectedOption => {
        this.setState({
            selectedOption
        });
    }

    handleChange = event => {
        this.setState({
            [event.target.id]: event.target.value
        });
    }
    

    /*share = () => {
        const facultyId = this.state.selectedOption && this.state.selectedOption.id;
        if (!facultyId) alert('please select member first');
        api.shareCalendar({userId: facultyId, permission: 'UPDATE'})
            .then(() => {
                alert('success');
            })
            .catch((err) => {
                alert('failed: ' + err.message);
            })
    }*/

    resetState = () => {
        this.setState({
            groupName: "",
            selectedOption: '',
            description: ""
        });
    }
    render() {
        //console.log(this.state.faculty);
        return(
            <div style={{ paddingTop: 1.5 + 'em' }}>
            <header className="App-header">
                    <h3 className="App-title">Create A Group</h3> 
            </header>
            
                
            <Form onSubmit={this.handleSubmit} style={{ padding: 1 + 'em' }}>
                <Form.Group controlId="title">
                    <Form.Label>Group Name:</Form.Label>
                    <Form.Control
                        autoFocus
                        type="cwid"
                        value={this.state.title}
                        onChange={this.handleChange}
                    />
                </Form.Group>

            <header className="App-header">
                    <h3 className="App-title">Select email</h3> 
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

<Form.Group controlId="description">
                    <Form.Label>Group Description:</Form.Label>
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
            <Button type="reset" onClick={this.resetState}>
                    Reset
            </Button>
            <Button variant="primary" type="submit">
                    Submit
                </Button>
                </Form>
                </div>   
        );
    }
}