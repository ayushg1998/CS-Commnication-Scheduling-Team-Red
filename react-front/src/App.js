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

    this.state = {
      isAuthenticated: false
    };
  }

  userHasAuthenitcated = authenticated => {
    this.setState({ isAuthenitcated: authenticated });
  }

  handleLogout = event => {
    localStorage.removeItem('userToken');
    this.userHasAuthenitcated(false);
    this.props.history.push('/login');
  }

  render () {
    const childProps = {
      isAuthenticated: this.state.isAuthenitcated,
      userHasAuthenitcated: this.userHasAuthenitcated
    };

    return (
      <div className="App container">
        <Navigation />
        <Routes childProps={childProps} />
      </div>
    );
  }
}

export default withRouter(App);