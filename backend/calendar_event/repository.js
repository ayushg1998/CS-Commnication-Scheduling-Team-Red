const assert = require('assert');
const moment = require('moment-timezone'); moment.tz.setDefault('utc');
const { sqlUtils } = require('../lib');

module.exports = function(mysql, {userRepository, resourceRepository, appointmentRepository}) {
  assert.ok(userRepository); assert.ok(resourceRepository);
  
  //NOTE: @deprecated?
  //this is not in appointmentRepository since it is very particular to calendar
  /*
    @return Promise<Array<{
      id,
      start,
      end,
      description,
      appointer: {
        id,
        fname,
        lname
      },
    }>>
  */
  async function getAppointmentsOfAppointee(userId) {
    let query = `SELECT U.fname as appointerFname,U.lname as appointerLname,U.id as appointerId,Ap.start,Ap.end,Ape.name,Ape.color,Ap.id`;
    query += ` FROM Appointment Ap JOIN AppointmentEvent Ape ON Ap.appointmentEventId=Ape.id JOIN User U ON  U.id=Ape.appointerId`;
    query += ` WHERE appointeeId=${userId}`;

    console.log(query);
    
    return new Promise(function(resolve, reject) {
      mysql.query(query, function(err, rows) {
        if (err) { reject(err); return; }
  
        const ret = rows.map(r => ({
          id: r.id,
          start: moment(r.start),
          end: moment(r.end),
          name: r.name,
          color: r.color,
          appointer: {
            fname: r.appointerFname,
            lname: r.appointerLname,
            id: r.appointerId
          }
        }));
  
        resolve(ret);
      });
    });
  }

  //NOTE: @deprecated?
  //TODO: got to have groups
  //TODO: have this in Event module
  /*
    @return Promise<Array<{
      id,
      name: string,
      description: string,
      image: string,
      start: moment,
      end: moment,
      color: string,
      creatorId: int
    }>>
  */
  async function getEventsForUser(userId) {
    const query = `SELECT * FROM Event`;
    return new Promise(function(resolve, reject){
      mysql.query(query, function(error, rows) {
        if (error) { reject(error); return;}
        resolve(rows.map(r => fromDBEvent(r)));
      });
    });
  }

   /*
    @return Promise<Array<{
      id,
      name: string,
      description: string,
      image: string,
      start: moment,
      end: moment,
      color: string,
      creatorId: int,
      groupId: int
    }>>
  */
  async function getEvents(eventIds) {
    if (!eventIds.length) return Promise.resolve([]);

    let query = `SELECT * FROM Event WHERE id IN ${sqlUtils.sqlLikeArray(eventIds)}`;
    
    return new Promise(function(resolve, reject) {
      mysql.query(query, function(err, rows) {
        if (err) { reject(err); return; }
  
        const ret = rows.map(r => ({
          ...r,
          start: moment(r.start),
          end: moment(r.end)
        }));
  
        resolve(ret);
      });
    });
  }

  return {
    getEvents,
    getAppointmentEvents: appointmentRepository.getAppointmentEvents,
    getAppointments: appointmentRepository.getAppointments,
    findUserById: userRepository.findUserById,
    getSoloGroupOfUser: userRepository.getSoloGroupOfUser,
    getUserResourceOfUser: resourceRepository.getUserResourceOfUser
  };
};