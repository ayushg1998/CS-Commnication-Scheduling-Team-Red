const moment = require('moment');
const assert = require('assert');
const constants = require('../constants');

module.exports = function(repository) {

  /*
    @return Promise<{
      appointmentEvents: Array<{start, end, id, description }>,
      events: Array<{start, end, name, id}>
    }>
  */
  async function getFacultyCalendarEvents(userId) {
    assert.ok(userId);
    const user = await repository.findUserById(userId); assert.ok(user);
    assert.ok(user.userType === constants.USERTYPE_FACULTY);

    let appointmentEvents = await repository.getAppointmentEventsofAppointer(userId);
    let events = await repository.getEventsForUser(userId);

    appointmentEvents = mapAppointmentEvents(appointmentEvents);
    events = mapEvents(events);

    return {appointmentEvents, events};
  }

  /*
    @return Promise<{
      appointments: Array<{start, end, description, id, appointer: { fname, lname, id } }>,
      events: Array<{start, end, name, id}>
    }>
  */
  async function getStudentCalendarEvents(userId) {
    assert.ok(userId);
    const user = await repository.findUserById(userId); assert.ok(user);
    assert.ok(user.userType === constants.USERTYPE_STUDENT);

    let appointments = await repository.getAppointmentsOfAppointee(userId);
    let events = await repository.getEventsForUser(userId);

    appointments = mapAppointments(appointments);
    events = mapEvents(events);

    return {appointments, events};
  }

  return {
    getFacultyCalendarEvents,
    getStudentCalendarEvents
  };
}

function mapAppointmentEvents(appointmentEvents) {
  return appointmentEvents.map(ape => ({
    id: ape.id,
    start: ape.start,
    end: ape.end,
    description: ape.description
  }))
  .sort(descSortFn);
}

function mapEvents(events) {
  return events.map(e => ({
    start: e.start,
    end: e.end,
    name: e.name,
    id: e.id
  }))
  .sort(descSortFn);
}

function mapAppointments(appointments) {
  return appointments.map(ap => ({
    id: ap.id,
    start: ap.start,
    end: ap.end,
    description: ap.description,
    appointer: {
      fname: ap.appointer.fname,
      lname: ap.appointer.lname,
      id: ap.appointer.id
    }
  }))
  .sort(descSortFn);
}

const descSortFn = (a, b) => a.start.isBefore(b.start);