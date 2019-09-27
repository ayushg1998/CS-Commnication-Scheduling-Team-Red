import React, { Component, Fragment } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Nav, NavItem, Navbar } from 'react-bootstrap';
import './App.css';
import Routes from './Routes';
import { LinkContainer } from 'react-router-bootstrap';
import Navigation from './components/Navigation';
import * as userFunctions from './shared/UserFunctions';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isAuthenticated: false,
      user: null
    };
  }

  componentDidMount() {
    this.setState({isAuthenticated: userFunctions.isAuthenticated(), user: userFunctions.getUser()});
  }

  userAuthenticationChanged = () => {
    this.setState({isAuthenticated: userFunctions.isAuthenticated(), user: userFunctions.getUser()});
  }

  handleLogout = event => {
    userFunctions.logout();
    this.userAuthenticationChanged();
  }

  render () {
    const childProps = {
      isAuthenticated: this.state.isAuthenticated,
      userAuthenticationChanged: this.userAuthenticationChanged,
      user: this.state.user
    };

    return (
      <div className="App container">
{/* <<<<<<< HEAD */}
        <Navigation />
{/* =======
        <Navbar fluid collapseOnSelect>
          <Navbar.Header>
            <Navbar.Brand>
              <Link to="/">CS Communication System</Link>
            </Navbar.Brand>
          </Navbar.Header>
            <Nav pullRight>
              {this.state.isAuthenticated
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
>>>>>>> d7972513a8c8c008eed5b1858ca1c82c65c202be */}
        <Routes childProps={childProps} />
      </div>
    );
  }
}

export default withRouter(App);