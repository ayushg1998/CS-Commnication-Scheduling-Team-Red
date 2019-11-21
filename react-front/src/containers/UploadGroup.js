import React, { Component } from 'react';
import * as api from '../shared/api';
import './ShareCalendar.css';
import './CreateEvent.css';

import Button from "react-bootstrap/Button";

import CSVReader from "react-csv-reader";

const CSV_HEADER_CWID = "ID number";
const CSV_HEADER_EMAIL = "Email address";

const csvInputStyle = { 
    border: '1px solid black', 
    width: 600, 
    color: 'black', 
    padding: 20 
};

export default class UploadGroup extends Component {
    constructor(props) {
        super(props);
        this.state = {
            groups: [],
            csvData: [],
            selectedGroup: -1,
            submitting: false
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
            csvData: [],
            selectedGroup: -1,
            submitting: false
        });
    }

    onCsvLoaded = data => {
        data = data.map(item => ({
            cwid: item[CSV_HEADER_CWID],
            email: item[CSV_HEADER_EMAIL],
        }));

        this.setState({csvData: data});
    }

    handleSubmit = () => {
        const { selectedGroup, csvData, submitting } = this.state;
        if (submitting) return;

        this.setState({submitting: true}, () => {
            if (selectedGroup == -1) {
                alert('Please select group'); 
                this.setState({submitting: false});
                return;
            }
            if (!csvData.length) {
                alert('0 members found'); 
                this.setState({submitting: false});
                return;
            }
            const cwids = csvData.map(d => d.cwid);
            const groupId = selectedGroup;

            api.addGroupMembers(groupId, cwids)
                .then(() => {
                    alert('success');
                })
                .catch(error => {
                    alert(error.message);
                })
                .finally(() => {
                    this.setState({submitting: false, csvData: []});
                })
        })        
    }

    render() {
        const { csvData, groups } = this.state;

        const papaparseOptions = {
            header: true,
            dynamicTyping: true,
            skipEmptyLines: true
        };

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
                    cssClass=""
                    onFileLoaded={this.onCsvLoaded}
                    parserOptions={papaparseOptions}
                    inputStyle={csvInputStyle} />
                <ul>
                    {
                        csvData.map(d => (
                            <li key={d.cwid}>{d.cwid}: {d.email}</li>
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