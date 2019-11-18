import React, { Component } from 'react';

//React-Bootstrap
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

//import LoaderButton from '../components/LoaderButton';
import { register } from '../shared/authService';
import './Register.css';

export default class Register extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoading: false,
            cwid: "",
            fname: "",
            lname: "",
            username: "",
            email: "",
            password: "",
            confirmPassword: "",
            userType: "",
            confirmationCode: "",
            newUser: null
        };
    }

    validateForm() {
        return (
            this.state.cwid.length > 0 &&
            this.state.fname.length > 0 &&
            this.state.lname.length > 0 &&
            this.state.username.length > 0 &&
            this.state.email.length > 0 &&
            this.state.password.length > 0 &&
            this.state.password === this.state.confirmPassword
        );
    }

    validateConfirmationForm() {
        return this.state.confirmationCode.length > 0;
    }

    handleChange = event => {
        this.setState({
            [event.target.id]: event.target.value
        });
    }

    handleOptionChange = event => {
        console.log("Radio change to: " + event.target.value);
        this.setState({
            userType: event.target.value
        });
    }

    handleSubmit = async event => {
        event.preventDefault();

        const newUser = {
            cwid: this.state.cwid,
            fname: this.state.fname,
            lname: this.state.lname,
            username: this.state.username,
            email: this.state.email,
            password: this.state.password,
            userType: this.state.userType
        };

        this.setState({ isLoading: true });
        this.setState({ newUser: "test" });
        this.setState({ isLoading: false });

        register(newUser).then(res => {
            if (res) {
                console.log("Received Information");
                //this.props.userHasAuthenticated(true);
                this.setState({ isAuthenicated: true });
                this.props.history.push("/login");
            } else {
                console.log("Something went wrong");
            }
        })
    }

    handleConfirmationSubmit = async event => {
        event.preventDefault();

        this.setState({ isLoading: true });
    }

    renderConfirmationForm() {
        return (
            <Form onSubmit={this.handleConfirmationSubmit} style={{ padding: 1 + 'em' }}>
                <Form.Group controlId="confirmationCode">
                    <Form.Label>Condirmation Code</Form.Label>
                    <Form.Control
                        autoFocus
                        type="tel"
                        value={this.state.confirmationCode}
                        onChange={this.handleChange} />
                    <Form.Text className="text-muted">Please check your email for the code.</Form.Text>
                </Form.Group>

                <Button variant="primary" type="submit">
                    Submit
                </Button>
            </Form>
        );
    }

    renderForm() {
        return (
            <Form onSubmit={this.handleSubmit} style={{ padding: 1 + 'em' }}>
                <Form.Group controlId="cwid">
                    <Form.Label>CWID</Form.Label>
                    <Form.Control
                        autoFocus
                        type="cwid"
                        value={this.state.cwid}
                        onChange={this.handleChange}
                    />
                </Form.Group>

                <Form.Group controlId="fname">
                    <Form.Label>First Name</Form.Label>
                    <Form.Control
                        type="fname"
                        value={this.state.fname}
                        onChange={this.handleChange}
                    />
                </Form.Group>

                <Form.Group controlId="lname">
                    <Form.Label>Last Name</Form.Label>
                    <Form.Control
                        type="lname"
                        value={this.state.lname}
                        onChange={this.handleChange}
                    />
                </Form.Group>

                <Form.Group controlId="username">
                    <Form.Label>Username</Form.Label>
                    <Form.Control
                        type="username"
                        value={this.state.username}
                        onChange={this.handleChange}
                    />
                </Form.Group>

                <Form.Group controlId="email">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                        type="email"
                        value={this.state.email}
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

                <Form.Group controlId="confirmPassword">
                    <Form.Label>Confirm Password</Form.Label>
                    <Form.Control
                        type="password"
                        value={this.state.confirmPassword}
                        onChange={this.handleChange}
                    />
                </Form.Group>

                <label htmlfor="userType">Register as:</label>
                <div className="form-check">
                    <label className="form-check-label">
                        <input type="radio" 
                            className="form-check-input"
                            name="userType"
                            value="student"
                            checked={this.state.userType === "student"}
                            onChange={this.handleOptionChange}
                        /> Student
                    </label>
                </div>
                <div className="form-check">
                    <label className="form-check-label">
                        <input type="radio" 
                            className="form-check-input"
                            name="userType"
                            value="faculty"
                            checked={this.state.userType === "faculty"}
                            onChange={this.handleOptionChange}
                        /> Faculty
                    </label>
                </div>

                <br />

                <Button variant="primary" type="submit">
                    Register
                </Button>
            </Form>
        );
    }

    render() {
        return (
            <div className="Register">
                {this.state.newUser === null
                    ? this.renderForm()
                    : this.renderConfirmationForm()}
            </div>
        );
    }
}