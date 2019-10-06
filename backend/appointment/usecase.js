const moment = require('moment');
const assert = require('assert');
const constants = require('../constants');

module.exports = function(repository) {

  async function addAppointmentEvent({start, end, slotInterval, description, appointerId}) {
    assert.ok(start); assert.ok(end); assert.ok(slotInterval); assert.ok(appointerId);
    assert.ok(Number.isInteger(slotInterval) && slotInterval > 0);

    start = moment(start); end = moment(end); assert.ok(start.isSameOrBefore(end));
    setSecondsToZero(start); setSecondsToZero(end);

    const diffInMinutes = end.diff(start, 'minutes'); assert.ok(diffInMinutes % slotInterval == 0);
    const slotCount = diffInMinutes / slotInterval; assert.ok(slotCount >= 1);
    

    const user = await repository.findUserById(appointerId);
    assert.ok(user);
    assert.ok(user.userType === constants.USERTYPE_FACULTY);

    await repository.addAppointmentEvent({start, end, slotInterval, description, appointerId, slotCount});
  }

  async function getAppointmentEventsOfAppointer(appointerId) {
    assert.ok(appointerId);
    const appointer = await getUser(appointerId); assert.ok(appointer);

    assert.ok(appointer.userType === constants.USERTYPE_FACULTY);
  
    return repository.getAppointmentEventsofAppointer(appointerId);
  }

  //TODO: position should be unique for a given appointmentEventId
  async function addAppointment({position, appointmentEventId, appointeeId}) {
    assert.ok(Number.isInteger(position) && position >= 0);
    assert.ok(appointeeId); assert.ok(appointmentEventId);

    const ae = await repository.getAppointmentEvent(appointmentEventId);
    assert.ok(ae); assert.ok(position < ae.slotCount);

    const startOffset = ae.slotInterval * position;
    const endOffset = startOffset + ae.slotInterval;

    const appointmentStart = ae.start.clone().add(startOffset, 'minutes');
    const appointmentEnd = ae.start.clone().add(endOffset, 'minutes');

    //TODO: HACK for demo
    appointmentStart.add(-5, 'hours');
    appointmentEnd.add(-5, 'hours');

    setSecondsToZero(appointmentStart); setSecondsToZero(appointmentEnd);

    await repository.addAppointment({
      start: appointmentStart, 
      end: appointmentEnd, appointeeId, position, appointmentEventId});
  }

  /*
    @return @see repository.getAppointmentEvent
  */
  async function getAppointmentEvent(appointmentEventId) {
    assert.ok(appointmentEventId);
    return repository.getAppointmentEvent(appointmentEventId);
  }

  /*
    @return @see repository.getAppointmentsOfAppointmentEvent
  */
  async function getAppointmentsOfAppointmentEvent(appointmentEventId) {
    assert.ok(appointmentEventId);
    return repository.getAppointmentsOfAppointmentEvent(appointmentEventId);
  }

  /*
    @return @see getUser
  */
  async function getAppointerOfAppointmentEvent(appointmentEventId) {
    assert.ok(appointmentEventId);

    const appointmentEvent = await repository.getAppointmentEvent(appointmentEventId); assert.ok(appointmentEvent);    
    return getUser(appointmentEvent.appointerId);
  }

  /*
    @return @see repository.getAppointment
  */
  async function getAppointment(appointmentId) {
    assert.ok(appointmentId);

    return repository.getAppointment(appointmentId);
  }

  /*
    @return @see repository.findUserById
  */
  async function getUser(userId) {
    return repository.findUserById(userId);
  }

  return {
    addAppointmentEvent,
    addAppointment,
    getAppointmentEventsOfAppointer,
    getAppointerOfAppointmentEvent,
    getAppointmentsOfAppointmentEvent,
    getAppointment,
    getAppointmentEvent,
    getUser
  };
}

function setSecondsToZero(m) {
  m.set('seconds', 0);
  m.set('milliseconds', 0);
}