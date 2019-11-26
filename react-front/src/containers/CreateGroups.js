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
      userSelect: [],
      userPool: [],
      description: ""
    };
  }

  validateForm() {
    return (
      this.state.groupName.length > 0 && this.state.userSelect.Length > 0
    );
  }

  componentDidMount() {
    //change this to getEmail api
    api.getAllUsers().then(res => {
      const userPool = res.map(user => ({label: user.fname + " " + user.lname,
                                          value: user.lname, 
                                          id: user.id,
                                          cwid: user.cwid}));
  
      this.setState({ userPool });
  });
  }

  handleSubmit = event => {
    event.preventDefault();
    const { groupName, description, userSelect } = this.state;

    const groupData = {
      name: groupName,
      description: description
    };

    api.createGroup(groupData)
        .then(groupId => {
            const cwids = userSelect.map(f => f.cwid);
            return api.addGroupMembers(groupId, cwids)
        })
        .then(() => {
            alert('The group has been created and the members have been added.');
            this.resetState();
        });        
  };

  handleOptionChange = selectedOption => {
    this.setState({
      selectedOption
    });
  };

  handleUserSelectChange = userSelect => {
    this.setState({ userSelect });
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
        userSelect: [],
        description: ""
    });
  };

  render() {
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
              placeholder="Group Name"
              value={this.state.groupName}
              onChange={this.handleGroupNameChange}
            />
          </Form.Group>

          <header className="App-header">
            <h3 className="App-title">Select email</h3>
          </header>
          <Select
            value={this.state.userSelect}
            multi
            options={this.state.userPool}
            onChange={this.handleUserSelectChange}
            placeholder="Select users to have em' as members"
            labelKey="label"
            valueKey="id"
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