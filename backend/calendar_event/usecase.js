const moment = require('moment');
const assert = require('assert');
const constants = require('../constants');
const {UPDATE, READ} = constants.permissions.user;

module.exports = function(repository, {resourceUsecase, eventUsecase, appointmentUsecase}) {
  assert.ok(resourceUsecase); assert.ok(eventUsecase); assert.ok(appointmentUsecase);
  /*
    @return Promise<{
      appointmentEvents: Array<{
        id, start, end,
        name, color, permission
      }>,
      events: Array<{
        id, start, end,
        name, color, permission
      }>
    }>
  */
  async function getFacultyCalendarEvents(userId) {
    assert.ok(userId);
    const user = await repository.findUserById(userId); assert.ok(user);
    assert.ok(user.userType === constants.USERTYPE_FACULTY);
    /*
      Array<{
        appointmentEventId: int, 
        permission: 'UPDATE+JOIN' || 'READ' || 'UPDATE' || 'JOIN', 
        resourceId: int
      }>
    */
    const appointmentEventResources = await appointmentUsecase.getAllVisibleAppointmentEventResourcesOfUser(userId);
    const appointmentEventIds = appointmentEventResources.map(o => o.appointmentEventId);
    let appointmentEvents = await repository.getAppointmentEvents(appointmentEventIds);

    /*
    Array<{
      eventId: int, 
      permission: 'UPDATE+JOIN' || 'READ' || 'UPDATE' || 'JOIN', 
      resourceId: int
    }>
    */
    const eventResources = await eventUsecase.getAllVisibleEventResourcesOfUser(userId);
    const eventIds = eventResources.map(o => o.eventId);
    let events = await repository.getEvents(eventIds);

    appointmentEvents = mapAppointmentEvents(appointmentEvents, appointmentEventResources);
    events = mapEvents(events, eventResources);

    return {appointmentEvents, events};
  }

  /*
    @return Promise<{
      appointments: Array<{
        id, start, end, 
        name, color, permission
      }>,
      events: Array<{
        id, start, end,
        name, color, permission
      }>
    }>
  */
  async function getStudentCalendarEvents(userId) {
    assert.ok(userId);
    const user = await repository.findUserById(userId); assert.ok(user);
    assert.ok(user.userType === constants.USERTYPE_STUDENT);

    const appointmentResources = await appointmentUsecase.getAllVisibleAppointmentResourcesOfUser(userId);
    const appointmentIds = appointmentResources.map(o => o.appointmentId);  
    let appointments = await repository.getAppointments(appointmentIds);
    appointments = mapAppointments(appointments, appointmentResources);

    const eventResources = await eventUsecase.getAllVisibleEventsOfUser(userId);
    const eventIds = eventResources.map(o => o.eventId);
    let events = await repository.getEvents(eventIds);
    events = mapEvents(events, eventResources);

    return {appointments, events};
  }

  //TODO: check if already shared, if so, then only change permission
  async function shareCalendarWithUser({sharerId, shareeId, permission}) {
    assert.ok(sharerId); assert.ok(shareeId); assert.ok(sharerId !== shareeId);
    assert.ok([UPDATE, READ].indexOf(permission) >= 0);

    const group = await repository.getSoloGroupOfUser(shareeId);
    const resource = await repository.getUserResourceOfUser(sharerId);

    await resourceUsecase.addResourcePermissionToUserGroup({
      groupId: group.id, 
      resourceId: resource.id, permission});
  }

  return {
    getFacultyCalendarEvents,
    getStudentCalendarEvents,
    shareCalendarWithUser
  };
}

function mapAppointmentEvents(appointmentEvents, appointmentEventResources) {
  return appointmentEvents.map(ape => {
    const permission = appointmentEventResources.find(r => r.appointmentEventId === ape.id).permission;
    const ret = {
      id: ape.id,
      start: ape.start,
      end: ape.end,
      name: ape.name,
      color: ape.color,
      permission
    };
    return ret;
  })
  .sort(descSortFn);
}

function mapEvents(events, eventResources) {
  return events.map(e => {
    const permission = eventResources.find(r => r.eventId === e.id).permission;
    const ret = {
      id: e.id,
      start: e.start,
      end: e.end,
      name: e.name,
      color: e.color,
      permission
    };
    return ret;
  })
  .sort(descSortFn);
}

function mapAppointments(appointments, appointmentResources) {
  return appointments.map(ap => {
    const permission = appointmentResources.find(r => r.appointmentId === ap.id).permission;

    return {
      id: ap.id,
      start: ap.start,
      end: ap.end,
      name: ap.name,
      color: ap.color,
      permission
    }
  })
  .sort(descSortFn);
}

const descSortFn = (a, b) => a.start.isBefore(b.start);