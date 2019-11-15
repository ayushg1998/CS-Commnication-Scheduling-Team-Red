import React, { Component } from 'react';
import * as api from '../shared/api';
import Select from 'react-select';
import './ShareCalendar.css';

export default class ShareCalendar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedOption: '',
            clearable: true,    
            faculty: []
        }
    }

    // componentDidMount(){
    //     api.getFaculty()
    //         .then(res => {
    //             let objectApp = [];
    //             console.log(res.faculties.length);

    //             for(let i =0; i<res.faculties.length; i++){
    //                 const fac = res.faculties[i];

    //                 objectApp.push({
    //                     label: fac.fname + " " + fac.lname,
    //                     value: fac.lname,
    //                     id: fac.id
    //                 });
    //             }

    //             console.log("This is objectApp: " + objectApp);

    //             this.setState({faculty:objectApp});
    //             console.log(this.state.faculty);
    //             return res;
    //         })
    // }

    // handleChange = selectedOption => {
    //     console.log(selectedOption);
    //     this.setState({
    //         selectedOption
    //     });
    // }

    // share = () => {
    //     const facultyId = this.state.selectedOption && this.state.selectedOption.id;
    //     if (!facultyId) alert('please select faculty first');
    //     api.shareCalendar({userId: facultyId, permission: 'UPDATE'})
    //         .then(() => {
    //             alert('success');
    //         })
    //         .catch((err) => {
    //             alert('failed: ' + err.message);
    //         })
    // }

    render() {
        //console.log(this.state.faculty);
        return(
            <div style={{ paddingTop: 1.5 + 'em' }}>
            <header className="App-header">
                    <h3 className="App-title">Share Calendar</h3>
                    <br />
                    <h4 className="App-title">Search for Faculty by Name</h4>
            </header>
                
            <Select
                name="form-field-name"
                value={this.state.value}
                isMulti
                onChange={this.handleChange}
                clearable={this.state.clearable}
                searchable={this.state.searchable}
                labelKey='name'
                valueKey='last name'                
                options={this.state.faculty} 
            />

            <button onClick={this.share}>Share</button>
            </div>    
        );
    }
}