const moment = require('moment');
const assert = require('assert');
const constants = require('../constants');

module.exports = function(repository) {
  async function addAppointmentEvent({start, end, slotInterval, description, appointerId}) {
    assert.ok(start); assert.ok(end); assert.ok(slotInterval); assert.ok(appointerId);
    assert.ok(Number.isInteger(slotInterval) && slotInterval > 0);

    start = moment(start); end = moment(end); assert.ok(start.isSameOrBefore(end));
    setSecondsToZero(start); setSecondsToZero(end);

    const diffInMinutes = end.diff(start, 'minutes');
    assert.ok(diffInMinutes % slotInterval == 0);

    const user = await repository.findUserById(appointerId);
    assert.ok(user);
    assert.ok(user.userType === constants.USERTYPE_FACULTY);

    await repository.addAppointmentEvent({start, end, slotInterval, description, appointerId});
  }

  async function getAppointmentEventsOfAppointer(appointerId) {
    assert.ok(appointerId);
    return repository.getAppointmentEventsofAppointer(appointerId);
  }

  async function addAppointment({position, appointmentEventId, appointeeId}) {
    assert.ok(Number.isInteger(position) && position >= 0);
    assert.ok(appointeeId); assert.ok(appointmentEventId);

    const ae = await repository.getAppointmentEvent(appointmentEventId);
    assert.ok(ae);
    
    const diffInMinutes = ae.end.diff(ae.start, 'minutes');
    const availablePositions = diffInMinutes / ae.slotInterval;

    assert.ok(position < availablePositions);

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
      end: appointmentEnd, appointeeId, appointmentEventId});
  }

  return {
    addAppointmentEvent,
    addAppointment,
    getAppointmentEventsOfAppointer
  };
}

function setSecondsToZero(m) {
  m.set('seconds', 0);
  m.set('milliseconds', 0);
}