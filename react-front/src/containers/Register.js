import React, { Component } from 'react';
import {
    HelpBlock,
    FormGroup,
    FormControl,
    ControlLabel
} from 'react-bootstrap';
import LoaderButton from '../components/LoaderButton';
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
            //confirmPassword: this.state.confirmPassword,
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
            <form onSubmit={this.handleConfirmationSubmit}>
                <FormGroup controlId="confirmationCode" bsSize="large">
                    <ControlLabel>Condirmation Code</ControlLabel>
                    <FormControl
                        autoFocus
                        type="tel"
                        value={this.state.confirmationCode}
                        onChange={this.handleChange} />
                    <HelpBlock>Please check your email for the code.</HelpBlock>
                </FormGroup>
                <LoaderButton
                    block
                    bsSize="large"
                    disabled={!this.validateConfirmationForm()}
                    type="submit"
                    isLoading={this.state.isLoading}
                    text="Verify"
                    loadingText="Verifying..."
                />
            </form>
        );
    }

    renderForm() {
        return (
            <form onSubmit={this.handleSubmit}>
                <FormGroup controlId="cwid" bsSize="large">
                    <ControlLabel>CWID</ControlLabel>
                    <FormControl
                        autoFocus
                        type="cwid"
                        value={this.state.cwid}
                        onChange={this.handleChange}
                    />
                </FormGroup>
                <FormGroup controlId="fname" bsSize="large">
                    <ControlLabel>First Name</ControlLabel>
                    <FormControl
                        type="fname"
                        value={this.state.fname}
                        onChange={this.handleChange}
                    />
                </FormGroup>
                <FormGroup controlId="lname" bsSize="large">
                    <ControlLabel>Last Name</ControlLabel>
                    <FormControl
                        type="lname"
                        value={this.state.lname}
                        onChange={this.handleChange}
                    />
                </FormGroup>
                <FormGroup controlId="username" bsSize="large">
                    <ControlLabel>Username</ControlLabel>
                    <FormControl
                        type="username"
                        value={this.state.username}
                        onChange={this.handleChange}
                    />
                </FormGroup>
                <FormGroup controlId="email" bsSize="large">
                    <ControlLabel>Email</ControlLabel>
                    <FormControl
                        type="email"
                        value={this.state.email}
                        onChange={this.handleChange}
                    />
                </FormGroup>
                <FormGroup controlId="password" bsSize="large">
                    <ControlLabel>Password</ControlLabel>
                    <FormControl
                        type="password"
                        value={this.state.password}
                        onChange={this.handleChange}
                    />
                </FormGroup>
                <FormGroup controlId="confirmPassword" bsSize="large">
                    <ControlLabel>Confirm Password</ControlLabel>
                    <FormControl
                        type="password"
                        value={this.state.confirmPassword}
                        onChange={this.handleChange}
                    />
                </FormGroup>

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

                <LoaderButton
                    block
                    bsSize="large"
                    disabled={!this.validateForm()}
                    type="submit"
                    isLoading={this.state.isLoading}
                    text="Register"
                    loadingText="Registering..."
                />
            </form>
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
