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
        viewGroups.getAllVisibleGroups()
        .then(res => {
            const visibleGroups = res.map(e => ({
                name: e.name,
                description: e.description,
                creator: e.creatorId
            }))
            this.setState({groups: visibleGroups})
        })
        .catch(error => {
            alert(error.message);
        })

        viewGroups.getSpecificGroup(25)
            .then(group => {
                console.log(group);
            })               
    }

    render () {
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