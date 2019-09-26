import React, { Component } from 'react';
import { FormGroup, FormControl, ControlLabel } from 'react-bootstrap';
import './Login.css';
<<<<<<< HEAD
import { login } from './UserFunctions';
import LoaderButton from '../components/LoaderButton';
=======
import { login } from '../shared/UserFunctions';
>>>>>>> d7972513a8c8c008eed5b1858ca1c82c65c202be
 
export default class Login extends Component {
    constructor(props) {
        super(props);

<<<<<<< HEAD
        this.state = {
            isLoading: false,
            username: "",
            password: ""
        };
=======
        this.state = { username: "", password: "" };
>>>>>>> d7972513a8c8c008eed5b1858ca1c82c65c202be

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

<<<<<<< HEAD
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
=======
        login({username, password}).then(res => {
            console.log(this.props);
            if (res) {
                console.log('logged in');
                console.log(res);
                this.props.userAuthenticationChanged();
>>>>>>> d7972513a8c8c008eed5b1858ca1c82c65c202be
            }
        })
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