import React, { Component } from 'react';
import * as displayFaculty from '../shared/api';
import Select from 'react-select';

import './CreateEvent.css';


export default class ShareCalendar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedOption: '',
            clearable: true,    
            faculty: []
        }
    }

    componentDidMount(){
        let faculty = (displayFaculty.getFaculty());
        console.log(faculty);
        
        faculty.then(res => {
            let objectApp = [];
            console.log(res.faculties.length);

            for(let i =0; i<res.faculties.length; i++){
                

                objectApp.push({
                    label: res.faculties[i].fname + " " + res.faculties[i].lname,
                    value: res.faculties[i].lname
                });
            }

            console.log("This is objectApp: " + objectApp);

            this.setState({faculty:objectApp});
            console.log(this.state.faculty);
            return res;
       })
    }

    handleChange = selectedOption => {
        console.log("In handle change");
        console.log(this.state.faculty);
        console.log(selectedOption);
        this.setState({
            selectedOption
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
        console.log(this.state.faculty);
        return(

            
            <div style={{ paddingTop: 1.5 + 'em' }}>
            <header className="App-header">
                    <h3 className="App-title">Share Calendar with</h3>
            </header>
                
            <Select
                name="form-field-name"
                value={this.state.value}
                onChange={this.handleChange}
                clearable={this.state.clearable}
                searchable={this.state.searchable}
                labelKey='name'
                valueKey='last name'                
                options={this.state.faculty} 
            />
    </div>    
        );
    }
}