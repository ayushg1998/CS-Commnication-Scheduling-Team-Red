import React, { Component } from 'react';
import * as viewGroups from '../shared/api';

class ViewGroups extends Component {
    constructor(props) {
        super(props);

        this.state = {
            groups: [],
            members: [],
        };
    }


    componentDidMount(){
        console.log(viewGroups.getAllVisibleGroups());
        viewGroups.getAllVisibleGroups()
        .then(res => {
            console.log(res);
            const visibleGroups = res.map(e => ({
                id: e.id,
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

    groupMembers(groupNumber){
        viewGroups.getSpecificGroup(groupNumber)
            .then(group => {
                
                
                    console.log(group.members); 
                    //console.log(group.members[i].lname);
                    this.setState({members: group.members});
                  /*return(
                  <div>
                    <ul>
                        <h5><li>Name: {group.members[i].fname} {group.members[i].lname}</li></h5>
                        </ul>
                        </div>
                  );*/
                
               
             //   {onclick(group.members)}
                
            }) 
    }
    
    onclick()
    {
       let groupMembers = this.state.members;

        for(let i = 0; i < groupMembers.length; i ++)
                {
                    console.log(groupMembers[i].fname);
                   return(
                        <div>
                        <ul>
                        <h5><li>Name: {groupMembers[i].fname} {groupMembers[i].lname}</li></h5>
                        </ul>
                        </div>
                   )
                }
    }

    render (
        styles = {
        margin: '20px',
        width: '100%',
        height: '150px',
        backgroundColor: '#d3d3d3',
      }) {
        console.log(this.state.groups);
        const gro = this.state.groups.map((group,i) => {
            return (
               <div key={i} style={styles} onClick={() => this.groupMembers(group.id)}>
                       <a>
                       <div >
                    <ul>
                        <h5><li>Name: {group.name}</li></h5>
                        <ul>
                        <h5><li>Description: {group.description}</li></h5>
                        <h5><li>Created By: {group.creator}</li></h5>
                        </ul>
                    </ul>
                    {this.onclick()}
                    </div>
                    </a>
                </div>
                );
        });
        return (
            <div className="container" >
                <h1>just testing</h1>
                {gro}
                
            </div>
        );
    }
}

export default ViewGroups;