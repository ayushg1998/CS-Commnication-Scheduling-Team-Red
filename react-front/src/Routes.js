import React from 'react';
import { Switch } from 'react-router-dom';
import Home from './containers/Home';
import NotFound from './containers/NotFound';
import Login from './containers/Login';
import Dashboard from './containers/Dashboard';
import Register from './containers/Register';
import AppliedRoute from './components/AppliedRoute';

export default ({ childProps }) =>
    <Switch>
        <AppliedRoute path="/" exact component={Home} />
        <AppliedRoute path="/login" exact component={Login} props={childProps} />
        <AppliedRoute path="/dashboard" exact component={Dashboard} />
        <AppliedRoute path="/register" exact component={Register} props={childProps} />

        { /* Catch all unmatched routes */}
        <AppliedRoute component={NotFound} />
    </Switch>;