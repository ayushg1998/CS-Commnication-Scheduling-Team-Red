import React, { Component } from 'react';

/*Previous Home is now named Landing*/
export default class Home extends Component {
  render() {
    const { user } = this.props;
    return (
      <div>
        <h2>Home ({user.userType})</h2>
        <p>{user.cwid}</p>
        <p>{user.username}</p>
        <p>{user.fname + " " + user.lname}</p>
        <p>{user.email}</p>
      </div>
    )
  }
}