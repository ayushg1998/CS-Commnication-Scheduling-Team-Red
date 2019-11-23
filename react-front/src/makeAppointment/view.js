import * as assert from 'assert';
import React, { Component } from 'react';
import Dialog from '../components/Dialog';

export default class View extends Component {

  /*@param controller

    setView(view)
    onViewStarted()
    onViewStopped()
    onAppointmentChange(position)
    onSubmit()
    onCloseClick()
  */
  constructor(props) {
    super(props);
    assert.ok(props.controller);
    this.controller = props.controller;
    this.controller.setView(this);
    this.state = {
      appointmentEventName: '',
      description: '',
      time: '',
      appointerName: '',
      occupancy: '',
      activeAppointment: -1,
      modalTitle: '',
      appointments: []
    }
  }

  componentDidMount() {
    this.controller.onViewStarted();
  }

  componentWillUnmount() {
    this.controller.onViewStopped();
  }
  
  /*@param appointmentEventName, string*/
  setAppointmentEventName(name) {
    this.setState({appointmentEventName: name});
  }

  /*@param description, string*/
  setDescription(description) {
    this.setState({description});
  }

  /*@param time, string*/
  setTime(time) {
    this.setState({time});
  }

  /*@param appointerName, string*/
  setAppointerName(appointerName) {
    this.setState({appointerName})
  }

  /*@param occupancy, string*/
  setSlotOccupancy(occupancy) {
    this.setState({occupancy});
  }

  setActiveAppointment(position) {
    this.setState({activeAppointment: position});
  }

  setModalTitle(title) {
    this.setState({modalTitle: title})
  }

  showAlert(message) { 
    alert(message);
  }

  /*@param appointments Array<{
    name: string,
    time: string,
    isOccupied: boolean,
    position: int
  }>
  */
  setAppointments(appointments) {
    this.setState({appointments});
  }

  handleActivePositionChange = pos => {
    this.controller.onAppointmentChange(pos);
  }

  handleSubmit = () => {
    this.controller.onSubmit();
  }

  handleCloseClick = () => {
    this.controller.onCloseClick();
  }

  render() {
    const { 
      appointmentEventName, description,
      time, appointerName, occupancy,
      modalTitle, appointments, activeAppointment
    } = this.state;

    return (
      <Dialog
        width={500}
        height={400}
        title={modalTitle}
        onClose={this.handleCloseClick}>
        <div>
          <p>Appointment Event Name: {appointmentEventName}</p>
          <p>Description: {description}</p>
          <p>Time: {time}</p>
          <p>Appointer Name: {appointerName}</p>
          <p>Occupancy: {occupancy}</p>

          <div style={{overflowX: 'auto', whiteSpace: 'nowrap'}}>
            <SlotView appointments={appointments} 
              activePosition={activeAppointment}
              onActivePositionChange={this.handleActivePositionChange}
              />
          </div>

          <button onClick={this.handleSubmit}>Submit</button>
        </div>
      </Dialog>
    );    
  }
}

const slotItemStyle = {
  display: 'inline-block',
  textAlign: 'center',
  marginLeft: '16px'
};

const activeSlotItemStyle = {
  ...slotItemStyle,
  backgroundColor: 'yellow'
}

class SlotView extends Component {
  constructor(props) {
    super(props);
  }

  //alert change to parent, only when the change occured, and it occuured right
  handleCheckChange = e => {
    const el = e.target;
    const { activePosition, onActivePositionChange } = this.props;

    const position = parseInt(el.getAttribute('data-position'));
    const isOccupied = el.getAttribute('data-isoccupied') === 'true';

    if (isOccupied || position === activePosition) return;
    onActivePositionChange(position);
  }

  render() {
    const { appointments, activePosition } = this.props;
    return appointments.map(ap => {
        const isActive = ap.position === activePosition;
        const slotItemStyle_ = isActive? activeSlotItemStyle: slotItemStyle;
        const isChecked = ap.isOccupied || isActive;

        return (
          <div 
            style={slotItemStyle_} 
            key={ap.position}>
            <input type="radio" 
              checked={isChecked}
              disabled={ap.isOccupied}
              data-isoccupied={ap.isOccupied}
              data-position={ap.position} 
              onChange={this.handleCheckChange}
              /> <br />
            <span>{ap.name}</span><br />
            <span>{ap.time}</span>          
          </div> );
      });
  }
}