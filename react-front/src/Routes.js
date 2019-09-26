import React from 'react';
import { Switch } from 'react-router-dom';
import Home from './containers/Home';
import NotFound from './containers/NotFound';
import Login from './containers/Login';
import AppliedRoute from './components/AppliedRoute';

export default ({ childProps }) =>
    <Switch>
        <AppliedRoute path="/" exact component={Home} />
        <AppliedRoute path="/login" exact component={Login} />

        { /* Catch all unmatched routes */}
        <AppliedRoute component={NotFound} />
    </Switch>;