import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import './App.css';
import Routes from './Routes';
import Navigation from './components/Navigation';

class App extends Component {
  constructor(props) {
    super(props);
  }

  render () {
    return (
      <div className="App custom-container">
        <Navigation />
        <Routes />
      </div>
    );
  }
}

/*
  <MakeAppointment
  request={'editAppointment'}
  appointmentEventId={1} 
  appointmentId={6} />
*/

export default withRouter(App);