import React, { Component } from 'react';
import * as viewGroups from '../shared/api';
class ViewGroups extends Component {
    constructor(props) {
        super(props);

        this.state = {
            groups: [],
            mem: [""],
            click: false,
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
                <div key={i} style={{margin: '20px'}, {width: '100%'},{height: '150px'},
{backgroundColor: 'gray',}} >
                 <a onClick={() => this.groupMembers(group.id)}>
                <div>
                <ul>
                <h5><li>Name: {group.name}</li></h5>
                <ul>
                <h5><li>Description: {group.description}</li></h5>
                <h5><li>Created By: {group.creator}</li></h5>
                <h5><li>Group ID: {group.id}</li></h5>
                </ul>
                </ul>
                </div>
                 </a>
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
                <div style={styles} >
                        <a onClick={() => this.onclick()}>
                        <div>
                     <ul>
                         <h5><li>Members: {members}</li></h5>
                     </ul>         
                     </div>
                     </a>
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