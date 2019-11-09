const { sqlUtils } = require('../lib');
const assert = require('assert');
const moment = require('moment');

module.exports = function(mysql, {userRepository, resourceRepository}) {
  assert.ok(userRepository); assert.ok(resourceRepository);
  
  /*
    @return Promise<{
      id: int,
      description: string,
      start: moment,
      end: moment,
      slotInterval: int,
      appointerId: int,
      slotCount: int,
      name: string,
      color: string
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
      slotCount,
      name,
      color
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

  /*
    @return Promise<int>
  */
  async function addAppointmentEvent({start, end, slotInterval, description, appointerId, slotCount, name, color, groupId}) {
    
    const query = `INSERT INTO AppointmentEvent (description, slotCount, start, end, slotInterval, appointerId, name, color, groupId)
    VALUES ${sqlUtils.sqlValues([description, slotCount, start, end, slotInterval, appointerId, name, color, groupId])};`;

    console.log(query);
    return new Promise(function(resolve, reject){
      mysql.query(query, function(err, result) {
          if (err) { reject(err);return; }
          resolve(result.insertId);
      });
    });
  }

  async function addAppointment({start, end, position, appointeeId, appointmentEventId}) {
    const o = toDBAppointment({start, end, appointeeId, position, appointmentEventId});
    const query = `INSERT INTO Appointment (start, end, appointeeId, position, appointmentEventId) VALUES ('${o.start}','${o.end}','${o.appointeeId}','${o.position}','${o.appointmentEventId}');`;
    console.log(query);
    return new Promise(function(resolve, reject){
      mysql.query(query, function(err, result) {
          if (err) { reject(err);return; }
          resolve(result.insertId);
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

  /*
    @param groupIds: Array<int>
    @return Array<{appointmentEventId, permission, resourceId}>
  */
  async function getAppointmentEventResourcesOfGroups(groupIds) {
    if (!groupIds.length) return Promise.resolve([]);

    const query = `
      SELECT URP.groupId,R.appointmentEventId,URP.permission,URP.resourceId
      FROM UserGroup_Resource_Permission URP 
      JOIN Resource R ON R.id=URP.resourceId
      WHERE URP.groupId IN ${sqlUtils.sqlLikeArray(groupIds)} AND R.appointmentEventId IS NOT NULL
      ORDER BY URP.groupId;`;

      return new Promise((resolve, reject) => {
        
        mysql.query(query, function(err, rows){
          if (err) {reject(err); return;}
          if (!rows.length) { resolve([]); return;}
  
          const result = []; let currentGroupId = -1;
          
          //since every (groupId, resource) pair is unique,
          //following aggregation method is chosen. Also,
          //easy one pass aggregation into result array could be done since,
          //rows are ordered by groupId
          rows.forEach(row => {
            if (currentGroupId != row.groupId) {
              result.push({
                groupId: row.groupId,
                resources: [{
                  appointmentEventId: row.appointmentEventId,
                  permission: row.permission,
                  resourceId: row.resourceId                  
                }]
              });
              currentGroupId = row.groupId;
            }
            else {
              result[result.length - 1].resources.push({
                appointmentEventId: row.appointmentEventId,
                permission: row.permission,
                resourceId: row.resourceId
              });
            }
          });
  
          resolve(result); 
        });
      }); 
  }

  return {
    getAppointmentEvent,
    getAppointmentEventResourcesOfGroups,
    getAppointmentEventsofAppointer,
    addAppointmentEvent,
    getAppointment,
    getAppointmentsOfAppointmentEvent,
    addAppointment,
    addAppointmentEventResource: resourceRepository.addAppointmentEventResource,
    addResourcePermissionToUserGroup: resourceRepository.addResourcePermissionToUserGroup,
    findUserById: userRepository.findUserById
  };
}

function toDBAppointmentEvent(ae) {
  return {
    ...ae,
    start: ae.start.toISOString(),
    end: ae.end.toISOString(),
    name: ae.name || null
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