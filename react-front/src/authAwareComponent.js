import React from 'react';
import * as authService from './shared/authService';
import { Redirect } from 'react-router-dom';

/*
    if WrappedComp is for e.g. Dashboard, isSecureComponent would be true
    if WrappedComp is for e.g. Login, isSecureComponent would be false
*/
export default function(WrappedComp, isSecureComponent) {
    return class extends React.Component {
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
            
            if (authenticated) {
                //user is logged in

                if (isSecureComponent) return <WrappedComp {...this.props} />

                //unsecure component is rendered, although user is authorized
                //therefore redirect to dashboard instead
                return <Redirect to='/dashboard' />;
            } else {
                //user needs to log in
                
                //secureComponent is rendered, although user needs to log in
                //therefore redirect to login instead
                if (isSecureComponent) return <Redirect to='/' />;


                return <WrappedComp {...this.props} />
            }
        }
      }; 
};