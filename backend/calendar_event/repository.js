const moment = require('moment');

module.exports = function(mysql, {appointmentRepository, userRepository}) {

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

  return {
    getAppointmentEventsofAppointer: appointmentRepository.getAppointmentEventsofAppointer,
    getAppointmentsOfAppointee,
    findUserById: userRepository.findUserById,
    getEventsForUser
  };
};

function fromDBEvent(event) {
  return {
    ...event,
    start: moment(event.start),
    end: moment(event.end)
  };
}