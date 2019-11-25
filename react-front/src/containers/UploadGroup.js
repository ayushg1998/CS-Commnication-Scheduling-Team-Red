import React, { Component } from 'react';
import * as api from '../shared/api';
import './ShareCalendar.css';
import './CreateEvent.css';

import Button from "react-bootstrap/Button";
import CSVReader from '../components/CsvReader';
import { parseWarhawkEmailsFromCsv } from '../shared/parser';

export default class UploadGroup extends Component {
    constructor(props) {
        super(props);
        this.state = {
            groups: [],
            selectedGroup: -1,
            submitting: false,
            emails: [],
            csv: null
        }
    }

    componentDidMount() {
        api.getAllVisibleGroups()
            .then(groups_ => {
                //groups with UPDATE permission
                //only concerned with name and id
                const groups = groups_.filter(g => g.permission === 'UPDATE')
                    .map(g => ({id:g.id, name: g.name}));
                
                this.setState({groups: groups});
            });
    }

    handleGroupSelectChange = e => {
        const groupId = e.target.value;
        this.setState({selectedGroup: groupId});
    }
   
    resetState = () => {
        this.setState({
            groups: [],
            selectedGroup: -1,
            submitting: false,
            csv: null,
            emails: []
        });
    }

    handleSubmit = () => {
        const { selectedGroup, csv, submitting } = this.state;
        if (submitting) return;

        this.setState({submitting: true}, () => {
            if (selectedGroup === -1) {
                alert('Please select group'); 
                this.setState({submitting: false});
                return;
            }
            if (!csv) {
                alert('Select csv');
                this.setState({submitting: false});
                return;
            }
            const groupId = selectedGroup;

            api.addGroupMembersAsCsv(groupId, csv)
                .then(() => {
                    alert('success');
                })
                .catch(error => {
                    alert(error.message);
                })
                .finally(() => {
                    this.setState({ submitting: false, csv: null, emails: [] });
                })
        })        
    }

    handleCsvRead = csv => {
        console.log(csv);
        this.setState({
            emails: parseWarhawkEmailsFromCsv(csv),
            csv
        });
    }

    render() {
        const { emails, groups } = this.state;

        return (
            <div className="bg">
            <div className="container panel-default">
                <h3>Select Groups to add members:</h3>
                <select onChange={this.handleGroupSelectChange}>
                    <option value={-1}>Select Group</option>
                    {
                        groups.map(g => (
                            <option key={g.id} value={g.id}>{g.name}</option>
                        ))
                    }
                </select>
                <br /> <br />                

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