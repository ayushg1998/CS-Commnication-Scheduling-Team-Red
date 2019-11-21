import React, { Component } from "react";
import * as api from "../shared/api";
import Select from "react-select";
import "./ShareCalendar.css";
import "./CreateEvent.css";
import './Login.css';
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

export default class CreateGroups extends Component {
  constructor(props) {
    super(props);
    this.state = {
      groupName: "",
      facultySelect: [],
      faculty: [],
      description: ""
    };
  }

  validateForm() {
    return (
      this.state.groupName.length > 0 && this.state.facultySelect.Length > 0
    );
  }

  componentDidMount() {
    //change this to getEmail api
    api.getFaculty().then(res => {
      let objectApp = [];

      for (let i = 0; i < res.faculties.length; i++) {
        const fac = res.faculties[i];

        objectApp.push({
          label: fac.fname + " " + fac.lname,
          value: fac.lname,
          id: fac.id,
          cwid: fac.cwid
        });
      }

      this.setState({ faculty: objectApp });
    });
  }

  handleSubmit = event => {
    event.preventDefault();
    const { groupName, description, facultySelect } = this.state;

    const groupData = {
      name: groupName,
      description: description
    };

    api.createGroup(groupData)
        .then(groupId => {
            const cwids = facultySelect.map(f => f.cwid);
            return api.addGroupMembers(groupId, cwids)
        })
        .then(() => {
            alert('groups created and members added');
            this.resetState();
        });        
  };

  handleOptionChange = selectedOption => {
    this.setState({
      selectedOption
    });
  };

  handleFacultySelectChange = (k, change) => {
      let facultySelect = this.state.facultySelect;

      if (change.action === 'remove-value' || change.action === 'pop-value') {
        const optionData = change.removedValue;

        facultySelect = facultySelect.filter(f => f.id !== optionData.id);
      } else if (change.action === 'select-option') {
        const optionData = change.option;
        
        facultySelect = [...facultySelect, optionData];
      } else if (change.action === 'clear') {
          facultySelect = [];
      }

      this.setState({
          facultySelect
      });
  }

  handleGroupNameChange = ev => {
      const name = ev.target.value;
      this.setState({groupName: name});
  }

  handleDescriptionChange = ev => {
    const description = ev.target.value;
    this.setState({description});
  }

  resetState = () => {
    this.setState({
        groupName: "",
        facultySelect: [],
        description: ""
    });
  };

  render() {
    //console.log(this.state.faculty);
    return (
      <div className="bg">
      <div className="container panel-default">
        <header className="App-header">
          <h3 className="App-title">Create A Group</h3>
        </header>

        <Form onSubmit={this.handleSubmit} style={{ padding: 1 + "em" }}>
          <Form.Group controlId="title">
            <Form.Label>Group Name:</Form.Label>
            <Form.Control
              autoFocus
              value={this.state.groupName}
              onChange={this.handleGroupNameChange}
            />
          </Form.Group>

          <header className="App-header">
            <h3 className="App-title">Select email</h3>
          </header>
          <Select
            name="form-field-name"
            value={this.state.facultySelect}
            isMulti
            onChange={this.handleFacultySelectChange}
            searchable={this.state.searchable}
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
              onChange={this.handleDescriptionChange}
            ></textarea>
          </Form.Group>
          <Button type="reset" onClick={this.resetState}>
            Reset
          </Button>
          <Button className="button-padding" variant="primary" type="submit">
            Submit
          </Button>
        </Form>
      </div>
      </div>
    );
  }
}

/*
HAVE SHARE IN ANOTHER SCREEEN, (in View Current Groups screen)

share = () => {
    const facultyId = this.state.selectedOption && this.state.selectedOption.id;
    if (!facultyId) alert("please select member first");
    api
      .shareCalendar({ userId: facultyId, permission: "UPDATE" })
      .then(() => {
        alert("success");
      })
      .catch(err => {
        alert("failed: " + err.message);
      });
  };


<div>
<header className="App-header">
    <h3 className="App-title">Share Group With:</h3>
</header>
<Select
    name="form-field-name"
    value={this.state.value}
    isMulti
    onChange={this.handleOptionChange}
    clearable={this.state.clearable}
    searchable={this.state.searchable}
    labelKey="name"
    valueKey="last name"
    options={this.state.faculty}
/>

<button onClick={this.share}>Share</button>
</div>

*/