import React, { Component } from "react";
import * as api from "../shared/api";
import Select from "react-select";
import "./ShareCalendar.css";
import "./CreateEvent.css";
import './Login.css';
import Form from "react-bootstrap/Form";
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
export default class CreateGroups extends Component {
  constructor(props) {
    super(props);
    this.state = {
      groupName: "",
      userSelect: [],
      userPool: [],
      description: "",
      upload: false,
      groups: [],
      csvData: [],
      selectedGroup: -1,
      submitting: false
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

  handleSubmitForm = event => {
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
            alert('groups created and members added');
            this.resetState();
        });        
  };

  onCsvLoaded = data => {
    data = data.map(item => ({
        cwid: item[CSV_HEADER_CWID],
        email: item[CSV_HEADER_EMAIL],
    }));

    this.setState({csvData: data});
}

handleSubmitUpload =() =>{
    const { selectedGroup, csvData, submitting } = this.state;
    if (submitting) return;

    this.setState({submitting: true}, () => {
        if (selectedGroup === -1) {
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
  upload()
  {const { csvData, groups } = this.state;
  
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
)
}
  resetState = () => {
    this.setState({
        groupName: "",
        userSelect: [],
        description: "",
        groups: [],
        csvData: [],
        selectedGroup: -1,
        submitting: false
    });
  };
uploadClick()
{
    let state  = this.state.upload
    return(
      state
    )
}
formCreate()
{
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
  render() {
    
    return (
      <div>
       <div>{this.formCreate()}</div>
       <div>{this.upload()}</div> 
      </div>
    )
    
    
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