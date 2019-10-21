import React from 'react';
import { Switch } from 'react-router-dom';
import Landing from './containers/Landing';
import NotFound from './containers/NotFound';
import Login from './containers/Login';
import Dashboard from './containers/Dashboard';
import Register from './containers/Register';
import CreateEvent from './containers/CreateEvent';
import AppliedRoute from './components/AppliedRoute';
import * as authService from './shared/authService';
import authAwareComponent from './authAwareComponent';
import Appointment from './containers/Appointments';
import MakeAppointment from './containers/MakeAppointment';
import ShareCalendar from './containers/shareCalendar';

class Logout extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        authService.logout();
    }

    render() {
        return <div></div>
    }
}

const WrappedLogin = authAwareComponent(Login, false);
const WrappedLanding = authAwareComponent(Landing, false);
const WrappedRegister = authAwareComponent(Register, false);

const WrappedDashboard = authAwareComponent(Dashboard, true);
const WrappedCreateEvent = authAwareComponent(CreateEvent, true);
const WrappedAppointment = authAwareComponent(Appointment, true);
const WrappedMakeAppointment = authAwareComponent(MakeAppointment, true);
const WrappedShareCalendar = authAwareComponent(ShareCalendar, true);
const WrappedLogout = authAwareComponent(Logout, true);

export default class Route extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            authenticated: authService.isAuthenticated()
        }
    }
  
    componentDidMount() {
    // ... that takes care of the subscription...
        authService.registerAuthStatusChangeListener(this.onAuthStatusChanged);
    }

    componentWillUnmount() {
        authService.unregisterAuthStatusChangeListener(this.onAuthStatusChanged);
    }

    onAuthStatusChanged = () => {
        this.setState({authenticated: authService.isAuthenticated()});
    }

    render() {
        const { authenticated } = this.state;

        return authenticated? (
            <Switch>       
                <AppliedRoute path="/" exact component={WrappedDashboard} />
                <AppliedRoute path="/dashboard" exact component={WrappedDashboard} />
                <AppliedRoute path="/createEvent" exact component={WrappedCreateEvent} />
                <AppliedRoute path="/Appointment" exact component={WrappedAppointment} />
                <AppliedRoute path="/MakeAppointment" exact component={WrappedMakeAppointment}/>
                <AppliedRoute path="/ShareCalendar" exact component={WrappedShareCalendar} />
                <AppliedRoute path="/logout" exact component={WrappedLogout} />
                { /* Catch all unmatched routes */}
                <AppliedRoute component={NotFound} />
            </Switch>
            ): (
                <Switch>
                    <AppliedRoute path="/" exact component={WrappedLanding} />
                    <AppliedRoute path="/login" exact component={WrappedLogin} />
                    <AppliedRoute path="/register" exact component={WrappedRegister} />
                </Switch>
        );
    }
}
