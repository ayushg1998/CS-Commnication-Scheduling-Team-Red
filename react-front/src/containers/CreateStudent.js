import React, { Component } from 'react';

//React-Bootstrap
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import * as api from '../shared/api';

export default class CreateStudent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            cwid: -1,
            fname: "",
            lname: "",
            username: "",
            email: "",
            password: ""
        }
    }

    handleChange = event => {
        this.setState({
            [event.target.id]: event.target.value
        });
    }

    resetState = () => {
        this.setState({
            cwid: -1,
            fname: "",
            lname: "",
            username: "",
            email: "",
            password: ""
        });
    }

    render() {
        return(
            <Form onSubmit={this.handleSubmit} style={{ padding: 1 + 'em' }}>
                <Form.Group controlId="cwid">
                    <Form.Label>CWID:</Form.Label>
                    <Form.Control
                        autoFocus
                        value={this.state.cwid}
                        onChange={this.handleChange}
                    />
                </Form.Group>

                <Form.Group controlId="fname">
                    <Form.Label>First Name:</Form.Label>
                    <Form.Control
                        autoFocus
                        value={this.state.fname}
                        onChange={this.handleChange}
                    />
                </Form.Group>

                <Form.Group controlId="lname">
                    <Form.Label>Last Name:</Form.Label>
                    <Form.Control
                        autoFocus
                        value={this.state.lname}
                        onChange={this.handleChange}
                    />
                </Form.Group>

                <Form.Group controlId="username">
                    <Form.Label>Username:</Form.Label>
                    <Form.Control
                        autoFocus
                        value={this.state.username}
                        onChange={this.handleChange}
                    />
                </Form.Group>

                <Form.Group controlId="email">
                    <Form.Label>Email address:</Form.Label>
                    <Form.Control
                        autoFocus
                        value={this.state.email}
                        onChange={this.handleChange}
                    />
                </Form.Group>

                <Form.Group controlId="password">
                    <Form.Label>Password:</Form.Label>
                    <Form.Control
                        autoFocus
                        value={this.state.password}
                        onChange={this.handleChange}
                    />
                </Form.Group>

                <Button type="reset" onClick={this.resetState}>
                    Reset
                </Button>

                <Button variant="primary" type="submit">
                    Submit
                </Button>
            </Form>
        );
    }
}
