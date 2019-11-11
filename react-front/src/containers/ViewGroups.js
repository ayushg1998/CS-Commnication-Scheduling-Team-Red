import React, { Component } from 'react';
import * as viewGroups from '../shared/api';

class ViewGroups extends Component {
    constructor(props) {
        super(props);

        this.state = {
            groups: []
        };
    }


    componentDidMount(){
        console.log(viewGroups.getAllVisibleGroups());
        viewGroups.getAllVisibleGroups()
        .then(res => {
            console.log(res);
            const visibleGroups = res.map(e => ({
                name: e.name,
                description: e.description,
                creator: e.creatorId
            }))
            console.log(visibleGroups);
            this.setState({groups: visibleGroups})
            console.log(this.state.groups);
        })
        .catch(error => {
            alert(error.message);
        })
               
    }

    render () {
        console.log(this.state.groups);
        const gro = this.state.groups.map((group,i) => {
            return (
                <div key={i}>
                    <ul>
                        <h5><li>Name: {group.name}</li></h5>
                        <ul>
                        <h5><li>Description: {group.description}</li></h5>
                        <h5><li>Created By: {group.creator}</li></h5>
                        </ul>
                    </ul>
                </div>
                );
        });

        return (
            <div className="container">
                <h1>just testing</h1>
                {gro}
            </div>
        );
    }
}

export default ViewGroups;