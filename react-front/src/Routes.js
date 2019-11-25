import React from 'react';
import { Switch } from 'react-router-dom';
import Landing from './containers/Landing';
import NotFound from './containers/NotFound';
import Login from './containers/Login';
import Dashboard from './containers/Dashboard';
import Register from './containers/Register';
import CreateStudent from './containers/CreateStudent';
import CreateEvent from './containers/CreateEvent';
import AppliedRoute from './components/AppliedRoute';
import * as authService from './shared/authService';
import authAwareComponent from './authAwareComponent';
import Appointment from './containers/Appointments';
import SignupForAppointment from './containers/SignupForAppointment';
import ShareCalendar from './containers/ShareCalendar';
import CreateGroups from './containers/CreateGroups';
import ShareGroups from './containers/ShareGroups';
import ShareEvent from './containers/ShareEvent';
import ShareAppointmentEvent from './containers/ShareAppointmentEvent';
import UploadGroup from './containers/UploadGroup';
import UploadUser from './containers/UploadUser';
import CreateFaculty from './containers/CreateFaculty';
import EditGroup from './editGroup';
import ViewGroups from './containers/ViewGroups';


class Logout extends React.Component {
    // constructor(props) {
    //     super(props);
    // }

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
const WrappedCreateStudent = authAwareComponent(CreateStudent, true);
const WrappedCreateEvent = authAwareComponent(CreateEvent, true);
const WrappedAppointment = authAwareComponent(Appointment, true);
const WrappedCreateFaculty = authAwareComponent(CreateFaculty, true);
const WrappedSignupForAppointment = authAwareComponent(SignupForAppointment, true);
const WrappedShareCalendar = authAwareComponent(ShareCalendar, true);
const WrappedCreateGroups = authAwareComponent(CreateGroups, true);
const WrappedShareGroups = authAwareComponent(ShareGroups, true);
const WrappedShareEvent = authAwareComponent(ShareEvent, true);
const WrappedShareAppointmentEvent = authAwareComponent(ShareAppointmentEvent, true);
const WrappedViewGroups = authAwareComponent(ViewGroups, true);
const WrappedUploadGroup = authAwareComponent(UploadGroup, true);
const WrappedUploadUser = authAwareComponent(UploadUser, true);
const WrappedEditGroup = authAwareComponent(EditGroup, true);
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
                <AppliedRoute path="/CreateStudent" exact component={WrappedCreateStudent} />
                <AppliedRoute path="/createEvent" exact component={WrappedCreateEvent} />
                <AppliedRoute path="/shareEvent" exact component={WrappedShareEvent} />
                <AppliedRoute path="/Appointment" exact component={WrappedAppointment} />
                <AppliedRoute path="/shareAppointment" exact component={WrappedShareAppointmentEvent} />
                <AppliedRoute path="/SignupForAppointment" exact component={WrappedSignupForAppointment} />
                <AppliedRoute path="/CreateGroups" exact component={WrappedCreateGroups} />
                <AppliedRoute path='/CreateFaculty' exact component={WrappedCreateFaculty} />
                <AppliedRoute path="/ViewGroups" exact component={WrappedViewGroups} />
                <AppliedRoute path="/ShareGroups" exact component={WrappedShareGroups} />
                <AppliedRoute path="/UploadGroup" exact component={WrappedUploadGroup} />
                <AppliedRoute path="/UploadUser" exact component={WrappedUploadUser} />
                <AppliedRoute path="/EditGroups" exact component={WrappedEditGroup} />
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
