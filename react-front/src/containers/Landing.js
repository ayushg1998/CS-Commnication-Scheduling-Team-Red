import React, { Component } from 'react';
import './Landing.css';

/*renamed previously named Home Component to Landing*/
export default class Landing extends Component {
    render() {
        return (
            <div className="Landing">
                <div className="lander">
                    <h1>CS Communication System</h1>
                    <p>This is a work in Progress</p>
                </div>
            </div>
        );
    }
}