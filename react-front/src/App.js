import React, { Component, Fragment } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Nav, NavItem, Navbar } from 'react-bootstrap';
import './App.css';
import Routes from './Routes';
import { LinkContainer } from 'react-router-bootstrap';
import Navigation from './components/Navigation';

class App extends Component {
  constructor(props) {
    super(props);
  }

  render () {

    return (
      <div className="App container">
        <Navigation />
        <Routes />
      </div>
    );
  }
}

export default withRouter(App);