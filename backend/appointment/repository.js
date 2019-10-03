const moment = require('moment');

module.exports = function(mysql, {userRepository}) {
  async function getAppointmentEvent(appointmentEventId) {
    return new Promise(function(resolve, reject){
      mysql.query(`SELECT * FROM AppointmentEvent WHERE id='${appointmentEventId}'`, function(err, rows) {
          if (err) { reject(err);return; }
          if (!rows.length) { resolve(null); return;}
          resolve(fromDBAppointmentEvent(rows[0]));
      });
    });
  }
  
  async function getAppointmentEventsofAppointer(appointerId) {
    return new Promise(function(resolve, reject){
      mysql.query(`SELECT * FROM AppointmentEvent WHERE appointerId='${appointerId}'`, function(err, rows) {
          if (err) { reject(err);return; }
          if (!rows.length) { resolve(null); return;}
          resolve(rows.map(r => fromDBAppointmentEvent(r)));
      });
    });
  }

  async function addAppointmentEvent({start, end, slotInterval, description, appointerId}) {
    const o = toDBAppointmentEvent({start, end, slotInterval, description, appointerId});
    return new Promise(function(resolve, reject){
      mysql.query(`INSERT INTO AppointmentEvent (description, start, end, slotInterval, appointerId) VALUES ('${o.description}','${o.start}','${o.end}','${o.slotInterval}','${o.appointerId}');`, function(err) {
          if (err) { reject(err);return; }          
          resolve(null);
      });
    });
  }

  async function addAppointment({start, end, appointeeId, appointmentEventId}) {
    const o = toDBAppointment({start, end, appointeeId, appointmentEventId});
    return new Promise(function(resolve, reject){
      mysql.query(`INSERT INTO Appointment (start, end, appointeeId, appointmentEventId) VALUES ('${o.start}','${o.end}','${o.appointeeId}','${o.appointmentEventId}');`, function(err) {
          if (err) { reject(err);return; }          
          resolve(null);
      });
    });
  }

  return {
    getAppointmentEvent,
    getAppointmentEventsofAppointer,
    addAppointmentEvent,
    addAppointment,
    findUserById: userRepository.findUserById
  };
}

function toDBAppointmentEvent(ae) {
  return {
    ...ae,
    start: ae.start.toISOString(),
    end: ae.end.toISOString()
  };
}

function toDBAppointment(ae) {
  return {
    ...ae,
    start: ae.start.toISOString(),
    end: ae.end.toISOString()
  };
}

function fromDBAppointmentEvent(ae) {
  return {
    ...ae,
    start: moment(ae.start),
    end: moment(ae.end)
  };
}