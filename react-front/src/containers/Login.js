import React, { Component } from 'react';

//React-Bootstrap
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

import './Login.css';
//import LoaderButton from '../components/LoaderButton';
import * as authService from '../shared/authService';
 
export default class Login extends Component {
    constructor(props) {
        super(props);

        this.state = { username: "", password: "" };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    validateForm() {
        return this.state.username.length > 0 && this.state.password.length > 0;
    }

    handleChange = event => {
        this.setState({
            [event.target.id]: event.target.value
        });
    }

    handleSubmit = event => {
        event.preventDefault();
        const {username, password} = this.state;

        //TODO: show loading spinner meanwhile
        authService.login({username, password})
            .catch(err => {
                alert('oops');
            })
    }

    render() {
        return (
            <div className="Login bg">
                    <Form className="panel-default" onSubmit={this.handleSubmit} style={{ padding: 1 + 'em' }}>
                        <Form.Group controlId="username">
                            <Form.Label>Username</Form.Label>
                            <Form.Control
                                autoFocus
                                type="username"
                                value={this.state.username}
                                onChange={this.handleChange}
                            />
                        </Form.Group>

                        <Form.Group controlId="password">
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                type="password"
                                value={this.state.password}
                                onChange={this.handleChange}
                            />
                        </Form.Group>

                        <Button type="submit" variant="primary">
                            Login
                        </Button>
                    </Form>
            </div>
        );
    }
}