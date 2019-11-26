import React, { Component } from 'react';
import * as api from '../shared/api';
import './ShareCalendar.css';
import './CreateEvent.css';

import Button from "react-bootstrap/Button";
import CSVReader from '../components/CsvReader';
import { parseWarhawkEmailsFromCsv } from '../shared/parser';

export default class UploadUser extends Component {
    constructor(props) {
        super(props);
        this.state = {
            submitting: false,
            emails: [],
            csv: null
        }
    }

    componentDidMount() {
        
    }

   
    resetState = () => {
        this.setState({
            submitting: false,
            csv: null,
            emails: []
        });
    }

    handleSubmit = () => {
        const { csv, submitting } = this.state;
        if (submitting) return;

        this.setState({submitting: true}, () => {
            if (!csv) {
                alert('File not selected. Please select a csv file.');
                this.setState({submitting: false});
                return;
            }

            api.createStudentsAsCsv(csv)
                .then(() => {
                    alert('The student user accounts have been created.');
                })
                .catch(error => {
                    alert("The user accounts could not be created." + error.message);
                })
                .finally(() => {
                    this.setState({ submitting: false, csv: null, emails: [] });
                })
        })        
    }

    handleCsvRead = csv => {
        this.setState({
            emails: parseWarhawkEmailsFromCsv(csv),
            csv
        });
    }

    render() {
        const { emails  } = this.state;

        return (
            <div className="bg">
                <div className="container panel-default">
                    
                    <h3>Select CSV file to upload:</h3>
                    <CSVReader
                        onRead={this.handleCsvRead}>
                        <button>Pick CSV file</button>
                    </CSVReader>

                    <ul>
                        {
                            emails.map((d, index) => (
                                <li key={index}>{d}</li>
                            ))
                        }
                    </ul>

                    <Button variant="primary" type="submit" onClick={this.handleSubmit}>
                        Submit
                    </Button>
                </div>
            </div>
        );
    }
}