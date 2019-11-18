import React, { Component } from 'react';
import * as displayFaculty from '../shared/api';
import Select from 'react-select';

import './CreateEvent.css';
import * as displayEvents from '../shared/api';
//import Card from 'react-ui-cards';

export default class MakeAppointment extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedOption: '',
            clearable: true,    
            faculty: [],
            appointments: []
        }
    }

    componentDidMount(){
        let faculty = (displayFaculty.getFaculty());
        console.log(faculty);
        
        faculty.then(res => {
            let objectApp = [];
            console.log(res.faculties.length);
            console.log(res.faculties);
            for(let i =0; i<res.faculties.length; i++){
                

                objectApp.push({
                    label: res.faculties[i].fname + " " + res.faculties[i].lname,
                    value: res.faculties[i].lname,
                    id: res.faculties[i].id
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
        console.log(selectedOption.id);
        
        let appointments = (displayEvents.getAppointmentEvent(selectedOption.id))
        console.log(appointments);
        appointments.then(res => {
            
            let objectApp = [];
            
            if(res.success === true){
                console.log(res.appointmentEvents.length)

                for(let i =0; i<res.appointmentEvents.length; i++){
                    objectApp.push({
                        title: res.appointmentEvents[i].name,
                        start: new Date(res.appointmentEvents[i].start),
                        end: new Date(res.appointmentEvents[i].end),
                        color: res.appointmentEvents[i].color
                    });
                }
            console.log(objectApp);
            this.setState({
                appointments: objectApp
            })
            console.log(this.state.appointments);
        }
        console.log(this.state.appointments.length);
        return res;
        })
        
        
    }

    handleSubmit = event => {
        event.preventDefault();

        const appointmentData = {
            title: this.state.title,
            description: this.state.description
        };

        console.log(appointmentData);
    }
    
    //displayAppointments(){
        //if(this.state.selectedOption !== ''){
            //console.log("Will print this");
        //}
    //}

    render() {
        console.log(this.state.faculty);
        
        const apps = this.state.appointments.map((app,i) => {
            return (
                <div key={i}>
                    <ul>
                        <h5><li>{app.title}</li></h5>
                    </ul>
                </div>
                );
        });
        
        console.log(this.state.faculty);
        return(

            
            <div className="container">
            <header className="App-header">
                    <h3 className="App-title">Search for Faculty by Name</h3>
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
            
            {apps}
    </div>    
        );
    }
}
