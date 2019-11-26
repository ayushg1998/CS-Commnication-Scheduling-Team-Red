import React, { Component } from "react";
import * as viewGroups from "../shared/api";
import * as DateUtils from '../shared/dateUtils';

class ViewAppointments extends Component {
  constructor(props) {
    super(props);

    this.state = {
      groups: [""],
      appointments: [],
      click: false
    };
  }

  componentDidMount() {
    viewGroups
      .getAllVisibleAppointmentEvents()
      .then(appointmentEvents => {
        this.setState({ appointments: appointmentEvents });
      })
      .catch(error => {
        alert(error.message);
      });
  }

  appointSign(id) {
    viewGroups.getAppointmentEventAndItsAppointments(id).then(ap => {

        const appointments = ap.appointments.map(k => {
            const { fname, lname } = k.appointee;
            const { start, end } = k;
            return fname + " " + lname +  " " +  `(${DateUtils.format_h(start)} - ${DateUtils.format_h(end)})`;
        });

      this.setState({ groups: appointments});

      return this.setState({ click: true });
    });
  }

  onclick() {
    return this.setState({ click: false });
  }

  members() {
    if (this.state.groups.length > 0) {
      return (
        <li>
          {this.state.groups.map(member => (
            <div>
              <li>{member}</li>
            </div>
          ))}
        </li>
      );
    } else {
      return <p>Currently there are no members in this group!</p>;
    }
  }

  control() {
    let enter = this.state.click;

    if (enter === false) {
      return (
        <div className="container">
          <h1>All Viewable Appointments</h1>

          {this.state.appointments.map((group, i) => {
            return (
              <div key={i} className="card" style={{ marginBottom: 3 + "em" }}>
                <h5 className="card-header">{group.name}</h5>
                <div className="card-body">
                  <ul className="list-group list-group-flush">
                    <li className="list-group-item">
                      <p className="card-text"><b>Name:</b> {group.name}</p>
                      <p className="card-text"><b>Description:</b> {group.description}</p>
                      <p className="card-text"><b>Span:</b> {span(group.start, group.end)}</p>
                      <p className="card-text"><b>Slots:</b> {group.slotCount}</p>
                      <p className="card-text"><b>Slot Interval:</b> {group.slotInterval} minutes</p>
                    </li>
                  </ul>
                  <a
                    href="#"
                    className="btn btn-primary"
                    onClick={() => this.appointSign(group.id)}
                    style={{ marginTop: 1 + "em" }}
                  >
                    View Signed
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      );
    }
    if ((enter = true)) {
      enter = false;
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
              style={{ marginTop: 1 + "em" }}
            >
              Go Back
            </a>
          </div>
        </div>
      );
    }
  }
  render() {
    return <div className="container">{this.control()}</div>;
  }
}

function span(start, end) {
    return `${DateUtils.format_ymdh(start)} - ${DateUtils.format_ymdh(end)}`;
}

export default ViewAppointments;