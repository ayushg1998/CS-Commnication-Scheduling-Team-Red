import React from 'react';
import { Switch } from 'react-router-dom';
import Landing from './containers/Landing';
import NotFound from './containers/NotFound';
import Login from './containers/Login';
<<<<<<< HEAD
import Dashboard from './containers/Dashboard';
import Register from './containers/Register';
import AppliedRoute from './components/AppliedRoute';

export default ({ childProps }) =>
    <Switch>
        <AppliedRoute path="/" exact component={Home} />
        <AppliedRoute path="/login" exact component={Login} props={childProps} />
        <AppliedRoute path="/dashboard" exact component={Dashboard} />
        <AppliedRoute path="/register" exact component={Register} props={childProps} />
=======
import Home from './containers/Home';
import AppliedRoute from './components/AppliedRoute';

export default ({ childProps }) =>
    childProps.isAuthenticated?
        (
            /*TODO: have here <Switch>...</Switch>  like below instead*/
            <Home {...childProps} />
        ): (
            <Switch>
                <AppliedRoute path="/" exact cProps={childProps} component={Landing} />
                <AppliedRoute path="/login" exact cProps={childProps} component={Login} />
>>>>>>> d7972513a8c8c008eed5b1858ca1c82c65c202be

                { /* Catch all unmatched routes */}
                <AppliedRoute component={NotFound} />
            </Switch>
        );