import React, { Component } from 'react';
import * as api from '../shared/api';
import Select from 'react-select';

import './ShareCalendar.css';
import './CreateEvent.css';
import './Login.css';

import Button from "react-bootstrap/Button";

export default class ShareCalendar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            clearable: true,    
            faculty: [],
            selectedFaculty: null,
            permissions: [
                {label: 'Update', value: 'UPDATE'},
                {label: 'Read', value: 'READ'}
            ],
            selectedPermission: null
        }
    }

    componentDidMount(){
        api.getFaculties()
            .then(faculties => {
                let objectApp = [];

                for(let i =0; i< faculties.length; i++){
                    const fac = faculties[i];

                    objectApp.push({
                        label: fac.fname + " " + fac.lname,
                        value: fac.lname,
                        id: fac.id
                    });
                }

                this.setState({faculty:objectApp});
            })
    }

    handleFacultyChange = selectedFaculty => {
        this.setState({selectedFaculty});
    }

    share = () => {
        const facultyId = this.state.selectedFaculty && this.state.selectedFaculty.id;
        const permission = this.state.selectedPermission && this.state.selectedPermission.value;

        if (!facultyId) {
            alert('please select faculty first'); return;
        }
        if (!permission) {
            alert('please select permission first'); return;
        }
        api.shareCalendar({userId: facultyId, permission })
            .then(() => {
                alert('success');
            })
            .catch((err) => {
                alert('failed: ' + err.message);
            })
    }

    handlePermissionChange = selectedPermission => {
        this.setState({selectedPermission});
    }

    render() {
        //console.log(this.state.faculty);
        return(
            <div className="bg">
            <div className="container panel-default">
            <header className="App-header">
                    <h3 className="App-title">Share Calendar</h3>
            </header>


            <h4 className="App-title">Search for Faculty by Name</h4>
                
            <Select
                value={this.state.selectedFaculty}
                onChange={this.handleFacultyChange}       
                options={this.state.faculty} 
            />

            <h4 className="App-title">Permission</h4>

            <Select
                value={this.state.selectedPermission}
                onChange={this.handlePermissionChange}       
                options={this.state.permissions} 
            />            

            <Button style={{ marginTop: 0.5 + 'em' }} variant="primary" type="submit" onClick={this.share}>
                Share
            </Button>
            </div> 
            </div>   
        );
    }
}