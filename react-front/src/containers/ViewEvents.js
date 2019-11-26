import React, { Component } from 'react';
import * as api from '../shared/api';
import * as DateUtils from '../shared/dateUtils';

const cardStyle = color => ({
  marginBottom: '1em',
  border: `2px solid #${color}`,
  borderRadius: '1em',
  padding: '1em'
})

export default class ViewEvents extends Component {
  constructor(props) {
    super(props);
    this.state = {
      events: []
    };
  }

  componentDidMount() {
    api.getAllVisibleEvents()
      .then(events => {
        events = events.map(e => ({
          name: e.name,
          description: e.description || 'N/A',
          start: DateUtils.format_ymdh(e.start),
          end: DateUtils.format_ymdh(e.start),
          color: e.color
        }));
        this.setState({events});
      })
  }

  render() {
    const { events } = this.state;
    return (
      <div className="container">
        <h2>View Events</h2> <br />
          {
            events.length? events.map(e => (
              <div style={cardStyle(e.color)} key={e.id}>
                <p><b>Name: </b>{e.name}</p>
                <p><b>Description: </b>{e.description}</p>
                <p><b>Start: </b>{e.start}</p>
                <p><b>End: </b>{e.end}</p>
              </div>
            )): <p>No Events!</p>
          }
      </div>
    );
  }
}
