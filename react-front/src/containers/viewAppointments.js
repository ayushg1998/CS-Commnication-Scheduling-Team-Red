import React, { Component } from 'react';
import * as viewGroups from '../shared/api';

class ViewAppointments extends Component {
    constructor(props) {
        super(props);

        this.state = {
            groups: [],
            appointments: [],
            click: false,
        };
    }
    
    componentDidMount(){
        viewGroups.getCalendarEvents()
        .then(res => {
      
            console.log(res.appointmentEvents.length);
            this.setState({appointments: res.appointmentEvents})
            console.log(this.state.appointments);
        })
        .catch(error => {
            alert(error.message);
        })     
        
    }

    appointSign(id){    
          let appoint = [];
              viewGroups.getAppointmentEventAndItsAppointments(id)
              .then(ap => {
                  console.log(ap.appointments[0].appointee.fname);
                  const apps = ap.appointments;
                   for(let i = 0;i<ap.appointments.length;i++)
                      { appoint.push(ap.appointments[i].appointee.fname+" "+ap.appointments[i].appointee.lname)}                 
                 console.log(appoint);              
              })
              this.setState({groups: appoint})
              this.setState({click: true})
              console.log(appoint)
                return (
                    this.setState({click: true}),
                    console.log(this.state.groups)
                    ); 
       /* viewGroups.getSpecificGroup(groupNumber)
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
            }) */       
    }
    
    onclick()
    {
        return(
        this.setState({click: false}),
        console.log(this.state.click)
        )
    }

    members()
    {
      console.log(this.state.groups.length)
        if(this.state.groups.length > 0)
            {
                return(
                <li>{this.state.groups.map((member) => (
                <li>{member}</li>
                    ))}</li>
                    )
            }
        else{
                return(<p>Currently there are no one signed up!</p>)
            }
    }
control()
{
        let enter = this.state.click;
    
     
      if(enter === false)
        {
            return(
                <div className="container" >
                <h1>just testing</h1>
    
                {this.state.appointments.map((group,i) => {
                  console.log(this.state.appointments);
                    return (
                        <div key={i} className="card" style={{ marginBottom: 3 + 'em' }}>
                            <h5 className="card-header">{group.name}</h5>
                            <div className="card-body">
                                <ul className="list-group list-group-flush">
                                    <li className="list-group-item"> 
                                        <h5 className="card-title">Name:</h5>
                                        <p className="card-text">{group.description}</p>
                                    </li>

                                </ul>
                                <a 
                                    href="#" 
                                    className="btn btn-primary" 
                                    onClick={() => this.appointSign(group.id)}
                                    style={{ marginTop: 1 + 'em' }}
                                >View Signed</a>
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
            return (
                <div className="card">
                    <h5 className="card-header">{this.state.groupName}</h5>
                    <div className="card-body">
                        <h5 className="card-title">Members:</h5>
                        <ul>
                            <li>{this.members()}</li>
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

export default ViewAppointments;