import React, { Component } from 'react';
import * as api from '../shared/api';
import Select from 'react-select';
import './ShareCalendar.css';

import Button from 'react-bootstrap/Button';
import FileDrop from 'react-file-drop';
import CSVReader from "react-csv-reader";

export default class UploadGroup extends Component {
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
    handleDrop = (files, event) => {
      console.log(files, event);
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
      const handleForce = data => console.log(data);

const papaparseOptions = {
  header: true,
  dynamicTyping: true,
  skipEmptyLines: true,
  transformHeader: header => header.toLowerCase().replace(/\W/g, "_")
};
      const styles = { border: '1px solid black', width: 600, color: 'black', padding: 20 };
      return (
        <div className="container">
    <CSVReader
      cssClass=""
      label="Selct CSV file to upload."
      onFileLoaded={handleForce}
      parserOptions={papaparseOptions}
    />
    <p>Open the console to view data in file for now.</p>
  </div>
  
        
      );
    }
}