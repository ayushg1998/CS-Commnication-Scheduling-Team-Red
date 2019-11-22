import * as assert from 'assert';
import React, { Component } from 'react';
import Select from 'react-select';
import 'react-select/dist/react-select.css';

export default class View extends Component {

  /*expectes a controller to be passed as props*/
  constructor(props) {
    super(props);
    assert.ok(props.controller);
    this.controller = props.controller;
    this.controller.setView(this);
    this.state = {
      groups: [],
      totalGroupMembersToAdd: [],
      totalGroupMembersToRemove: [],
      selectedGroupMembersToAdd: [],
      selectedGroupMembersToRemove: [],
      selectedGroup: null,
      disableUI: true
    }
  }

  componentDidMount() {
    this.controller.onViewStarted();
  }

  componentWillUnmount() {
    this.controller.onViewStopped();
  }

  /*@param groups Array<{id: int, name: string}>*/
  setGroups(groups) {
    this.setState({groups});
  }

  /*@param group {id: int, name: string} */
  setSelectedGroup(group) {
    this.setState({selectedGroup: group});
  }
  
  /*@param members Array<{id: int, name: string}>*/
  setTotalGroupMembersToAdd(members) {
    this.setState({totalGroupMembersToAdd: members});
  }

  /*@param members Array<{id: int, name: string}>*/
  setTotalGroupMembersToRemove(members) {
    this.setState({totalGroupMembersToRemove: members});
  }

  /*@param members Array<{id: int, name: string}>*/
  setSelectedGroupMembersToAdd(members) {
    this.setState({selectedGroupMembersToAdd: members});
  }

  /*@param members Array<{id: int, name: string}>*/
  setSelectedGroupMembersToRemove(members) {
    this.setState({selectedGroupMembersToRemove: members});
  }

  /*disable buttons, and other form elements*/
  disableAllInteraction() {
    this.setState({disableUI: true});
  }

  /*enable what is disabled in disableAllInteraction()*/
  enableAllInteraction() {
    this.setState({disableUI: false});
  }

  /*alert() function; might be replaced with custom message box*/
  showAlert(message) {
    alert(message);
  }

  handleMembersToAddChange = membersToAdd => {
    const memberIds = membersToAdd.map(m => m.id);
    this.controller.onSelectedAddGroupMembersChanged(memberIds);
  }

  handleMembersToRemoveChange = membersToRemove => {
    const memberIds = membersToRemove.map(m => m.id);
    this.controller.onSelectedRemoveGroupMembersChanged(memberIds);
  }

  handleGroupChange = group => {
    const groupId = group? group.id: null;
    this.controller.onGroupSelected(groupId);
  }

  handleAddGroupMember = () => {
    this.controller.onAddGroupMemberSubmit();
  }

  handleRemoveGroupMember = () => {
    this.controller.onRemoveGroupMemberSubmit();
  }

  render() {
    const { totalGroupMembersToAdd, selectedGroupMembersToAdd,
      totalGroupMembersToRemove, selectedGroupMembersToRemove,
      selectedGroup, groups, disableUI } = this.state;

    return <div>
        <Select
          disabled={disableUI}
          value={selectedGroup}
          options={groups}
          onChange={this.handleGroupChange}
          labelKey="name"
          valueKey="id"
          placeholder="Select Group" />

        <Select
          disabled={disableUI}
          value={selectedGroupMembersToAdd}
          multi
          options={totalGroupMembersToAdd}
          onChange={this.handleMembersToAddChange}
          placeholder="Select Members to be added to group"
          labelKey="name"
          valueKey="id"
        />

        <Select
          disabled={disableUI}
          value={selectedGroupMembersToRemove}
          multi
          options={totalGroupMembersToRemove}
          onChange={this.handleMembersToRemoveChange}
          placeholder="Select Members to be removed from group"
          labelKey="name"
          valueKey="id"
        />

        <button disabled={disableUI} onClick={this.handleAddGroupMember}>Add group members</button>
        <button disabled={disableUI} onClick={this.handleRemoveGroupMember}>Remove group members</button>
    </div>
  }
}