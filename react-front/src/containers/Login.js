import React, { Component } from 'react';
import { FormGroup, FormControl, ControlLabel } from 'react-bootstrap';
import './Login.css';
import { login } from './UserFunctions';
import LoaderButton from '../components/LoaderButton';
 
export default class Login extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoading: false,
            username: "",
            password: ""
        };

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
        // const username = this.state.username;
        // const password = this.state.password;

        event.preventDefault();

        this.setState({ isLoading: true });

        const user = {
            username: this.state.username,
            password: this.state.password
        };

        login(user).then(res => {
            if (res) {
                console.log("Received Information");
                //this.props.userHasAuthenticated(true);
                this.setState({ isAuthenicated: true });
                this.props.history.push("/Dashboard");
            }
        })

        // fetch('http://localhost:8080/login', {
        //     method: 'POST',
        //     body: JSON.stringify((username, password)),
        //     headers: {
        //         'Accept': 'application/json, text/plain, */*',
        //         'Content-Type': 'application/json'
        //     }
        // }).then(res => res.json())
        // .then(res => {
        //     if (!res.success) {
        //         throw new Error(res.message);
        //     }
        //     this.props.userHasAuthenticated(true);
        //     console.log("Hello")
        //     return res.state;
        // });
    }

    render() {
        return (
            <div className="Login">
                <form onSubmit={this.handleSubmit}>
                    <FormGroup controlId="username" bsSize="large">
                        <ControlLabel>Username</ControlLabel>
                        <FormControl
                            autoFocus
                            type="username"
                            value={this.state.username}
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
                    <LoaderButton
                        block
                        bsSize="large"
                        disabled={!this.validateForm()}
                        type="submit"
                        isLoading={this.state.isLoading}
                        text="Login"
                        loadingText="Logging in..."
                    />
                </form>
            </div>
        );
    }
}