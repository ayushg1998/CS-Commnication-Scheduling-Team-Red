import React, { Component } from 'react';
import * as viewGroups from '../shared/api';
class ViewGroups extends Component {
    constructor(props) {
        super(props);

        this.state = {
            groups: [],
            mem: [""],
            click: false,
            groupName: ""
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
   let styles = {
            margin: '20px',
            width: '100%',
            height: '150px',
            backgroundColor: '#d3d3d3',
          }     
          let membersInGroup = [];
        viewGroups.getSpecificGroup(groupNumber)
            .then(group => {       
                             
                   
                this.setState({groupName: group.name})            
                for(let i = 0; i< group.members.length; i++)
                {
                   
                   console.log(groupNumber +" look here " + group.members[i].fname+ " "+group.members[i].lname);
                   membersInGroup.push(group.members[i].fname+" "+group.members[i].lname);
                   
                }            
                
                this.setState({mem: membersInGroup})
                return (
                    this.setState({click: true}),
                    console.log(this.state.mem)
                    );
             
            })
            
    }


   /* members()
    {
        let styles = {
            margin: '20px',
            width: '100%',
            height: '150px',
            backgroundColor: '#d3d3d3',
        }
        for(let i = 0; i < this.state.mem.length; i++){
            return (
               <div key={i} style={styles} >
                       <a onClick={() => this.control()}>
                       <div>
                    <ul>
                        <h5><li>Name: {this.state.mem[i]}</li></h5>
                    </ul>
                    
                    </div>
                    </a>
                </div>
                );
    }
}*/
    
    onclick()
    {
        return(
        this.setState({click: false}),
        console.log(this.state.click)
        )
    }
control()
{
        let members = "";
        let enter = this.state.click;
    let styles = {
        margin: '20px',
        width: '100%',
        height: '150px',
        backgroundColor: 'gray',
    }
     
      if(enter === false)
        {
    return(
            <div className="container" >
            <h1>just testing</h1>
    
        {this.state.groups.map((group,i) => {
            return (
                <div key={i} className="card" style={{ marginBottom: 3 + 'em' }}>
                    <h5 className="card-header">{group.name}</h5>
                    <div className="card-body">
                        <ul className="list-group list-group-flush">
                            <li className="list-group-item">
                                <h6 className="card-title">Description:</h6>
                                <p className="card-text">{group.description}</p>
                            </li>
                            <li className="list-group-item">
                                <h5 className="card-title">Created By:</h5>
                                <p className="card-text">{group.creator}</p>
                            </li>
                            <li className="list-group-item">
                                <h5 className="card-title">Group ID:</h5>
                                <p className="card-text">{group.id}</p>
                            </li>
                        </ul>
                        <a 
                            href="#" 
                            className="btn btn-primary" 
                            onClick={() => this.groupMembers(group.id)}
                            style={{ marginTop: 1 + 'em' }}
                        >View Members</a>
                        <a 
                            href="#" 
                            className="btn btn-primary" 
                            style={{ marginTop: 1 + 'em', marginLeft: 0.5 + 'em' }}
                        >Add Members</a>
                        <a 
                            href="#" 
                            className="btn btn-primary" 
                            style={{ marginTop: 1 + 'em', marginLeft: 0.5 + 'em' }}
                        >Remove Members</a>
                    </div>
                </div>
                );
        })}       
                 </div>
  )
        }
        if(enter = true)
        {
            enter= false
            for(let i = 0; i < this.state.mem.length; i++){
                console.log(this.state.mem.length);
                    members += this.state.mem[i] + "\n";
                    
            }
            return (
                <div className="card">
                    <h5 className="card-header">{this.state.groupName}</h5>
                    <div className="card-body">
                        <h5 className="card-title">Members:</h5>
                        <ul>
                            <li>{members}</li>
                        </ul>
                        <a 
                            href="#" 
                            className="btn btn-primary" 
                            onClick={() => this.onclick()}
                            style={{ marginTop: 1 + 'em' }}
                        >Bo Back</a>
                    </div>
                </div>
            );
        }
}
    render () {
        return (
           <div className="container" >
                {this.control()}              
              </div>              
        )      
    }
}

export default ViewGroups;
