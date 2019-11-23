import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import './App.css';
import Routes from './Routes';
import Navigation from './components/Navigation';

import MakeAppointment from './makeAppointment';
//import ViewDataMapper from './makeAppointment/view_data_mapper';

class App extends Component {
  constructor(props) {
    super(props);
  }

  render () {
    return (
      <div className="App custom-container">
        {/* <Navigation />
        <Routes /> */}

        <MakeAppointment
          request={'editAppointment'}
          appointmentEventId={1} 
          appointmentId={6} />
      </div>
    );
  }
}

//export default withRouter(App);
export default App;