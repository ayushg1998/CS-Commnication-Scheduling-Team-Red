import React, { Component, Fragment } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Nav, NavItem, Navbar } from 'react-bootstrap';
import './App.css';
import Routes from './Routes';
import { LinkContainer } from 'react-router-bootstrap';

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
    //Clear session when logged out?

    this.userHasAuthenitcated(false);
  }

  render () {
    const childProps = {
      isAuthenticated: this.state.isAuthenitcated,
      userHasAuthenitcated: this.userHasAuthenitcated
    };

    return (
      <div className="App container">
        <Navbar fluid collapseOnSelect>
          <Navbar.Header>
            <Navbar.Brand>
              <Link to="/">CS Communication System</Link>
            </Navbar.Brand>
          </Navbar.Header>
            <Nav pullRight>
              {this.state.isAuthenitcated
                ? <NavItem onClick={this.handleLogout}>Logout</NavItem>
                : <Fragment>
                  <LinkContainer to="/register">
                    <NavItem>Register</NavItem>
                  </LinkContainer>
                  <LinkContainer to="/login">
                    <NavItem>Login</NavItem>
                  </LinkContainer>
                </Fragment>
              }
            </Nav>
        </Navbar>
        <Routes childProps={childProps} />
      </div>
    );
  }
}

export default withRouter(App);