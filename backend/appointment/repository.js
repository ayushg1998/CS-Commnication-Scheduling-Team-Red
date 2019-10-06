const moment = require('moment');

module.exports = function(mysql, {userRepository}) {
  /*
    @return Promise<{
      id: int,
      description: string,
      start: moment,
      end: moment,
      slotInterval: int,
      appointerId: int,
      slotCount: int
    }>
  */
  async function getAppointmentEvent(appointmentEventId) {
    return new Promise(function(resolve, reject){
      mysql.query(`SELECT * FROM AppointmentEvent WHERE id='${appointmentEventId}'`, function(err, rows) {
          if (err) { reject(err);return; }
          if (!rows.length) { resolve(null); return;}
          resolve(fromDBAppointmentEvent(rows[0]));
      });
    });
  }

    /*
    @return Promise<{
      id: int,
      appointmentEventId: int,
      appointeeId: int,
      position: int,
      start: moment,
      end: moment,
    }>
  */
  async function getAppointment(appointmentId) {
    return new Promise(function(resolve, reject){
      mysql.query(`SELECT * FROM Appointment WHERE id='${appointmentId}'`, function(err, rows) {
          if (err) { reject(err);return; }
          if (!rows.length) { resolve(null); return;}
          resolve(fromDBAppointment(rows[0]));
      });
    });
  }

  /*
    @return Promise<Array<{
      id,
      description,
      start: moment,
      end: moment,
      slotInterval,
      appointerId,
      slotCount
    }>>  
  */
  async function getAppointmentEventsofAppointer(appointerId) {
    return new Promise(function(resolve, reject){
      mysql.query(`SELECT * FROM AppointmentEvent WHERE appointerId='${appointerId}'`, function(err, rows) {
          if (err) { reject(err);return; }
          resolve(rows.map(r => fromDBAppointmentEvent(r)));
      });
    });
  }

  async function addAppointmentEvent({start, end, slotInterval, description, appointerId, slotCount}) {
    const o = toDBAppointmentEvent({start, end, slotInterval, description, appointerId, slotCount});
    const query = `INSERT INTO AppointmentEvent (description, slotCount, start, end, slotInterval, appointerId) VALUES ('${o.description}','${o.slotCount}','${o.start}','${o.end}','${o.slotInterval}','${o.appointerId}');`;
    return new Promise(function(resolve, reject){
      mysql.query(query, function(err) {
          if (err) { reject(err);return; }
          resolve(null);
      });
    });
  }

  async function addAppointment({start, end, position, appointeeId, appointmentEventId}) {
    const o = toDBAppointment({start, end, appointeeId, position, appointmentEventId});
    const query = `INSERT INTO Appointment (start, end, appointeeId, position, appointmentEventId) VALUES ('${o.start}','${o.end}','${o.appointeeId}','${o.position}','${o.appointmentEventId}');`;
    console.log(query);
    return new Promise(function(resolve, reject){
      mysql.query(query, function(err) {
          if (err) { reject(err);return; }
          resolve(null);
      });
    });
  }

  /*
    @return Promise<Array<{
      id: int,
      start: moment,
      end: moment,
      position: int,
      appointmentEventId: int,
      apointee: {
        fname: string,
        lname: string,
        id: int
      }      
    }>>
  */
  async function getAppointmentsOfAppointmentEvent(appointmentEventId) {
    const query = `SELECT U.fname,U.lname,A.id as id,A.appointeeId,A.position,A.appointmentEventId,A.start,A.end from appointment as A JOIN User as U ON U.id=A.appointeeId where A.appointmentEventId=${appointmentEventId};`;
    return new Promise(function(resolve, reject){
      mysql.query(query, function(err, rows) {
        if (err) { reject(err);return; }
        const ret = rows.map(r => ({
          id: r.id,
          start: moment(r.start),
          end: moment(r.end),
          position: r.position,
          appointmentEventId: appointmentEventId,
          apointee: {
            fname: r.fname,
            lname: r.lname,
            id: r.appointeeId
          }
        }));
        resolve(ret);
      });
    });
  }

  return {
    getAppointmentEvent,
    getAppointmentEventsofAppointer,
    addAppointmentEvent,
    getAppointment,
    getAppointmentsOfAppointmentEvent,
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

function fromDBAppointment(ap) {
  return {
    ...ap,
    start: moment(ap.start),
    end: moment(ap.end)
  };
}