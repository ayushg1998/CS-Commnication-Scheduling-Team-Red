import React, { Component } from 'react';

/*Previous Home is now named Landing*/
export default class Home extends Component {
<<<<<<< HEAD
    render() {
        return (
            <div className="Home">
                <div className="lander">
                    <h1>CS Communication System</h1>
                    <p>Please login or register to continue.</p>
                </div>
            </div>
        );
    }
=======
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
>>>>>>> d7972513a8c8c008eed5b1858ca1c82c65c202be
}