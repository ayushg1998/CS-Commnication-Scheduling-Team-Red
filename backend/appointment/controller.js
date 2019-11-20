const assert = require('assert');

module.exports = function(usecase) {

  /*
    @body {
      start,
      end,
      name,
      color,
      description,
      slotInterval,
    }

    @response {
      success: true
    }
  */
  async function addAppointmentEvent(req, res, next) {
    try {
      const {start, slotCount, slotInterval, description, name, color, groupId} = req.body;
      const appointerId = req.user.id;

      const appointmentEventId = await usecase.addAppointmentEvent({start, slotCount, slotInterval, description, appointerId, name, color, groupId});
      res.send({success: true, appointmentEventId });
    } catch(error) {
      res.send({success: false, message: error.message});
    }
  }

  /*
    @query {
      appointerId
    }

    @response {
      success: true,
      appointmentEvents: Array<{
        id,
        description,
        name,
        color,
        start,
        end,
        slotInterval,
        slotCount,
        appointerId
      }>
    }
  */
  async function getAppointmentEvents(req, res, next) {
    try {
      const appointerId = req.query.appointerId;
      const appointmentEvents = await usecase.getAppointmentEventsOfAppointer(appointerId);

      res.send({success: true, appointmentEvents});
    } catch(error) {
      res.send({success: false, message: error.message});
    }
  }

  
  /*
    @body {
     position
     appointmentEventId
    }

    @response {
      success: true
    }
  */
  async function addAppointment(req, res, next) {
    try {
      const appointeeId = req.user.id;
      const {position, appointmentEventId} = req.body;

      await usecase.addAppointment({position, appointmentEventId, appointeeId});
      res.send({success: true});
    } catch(error) {
      res.send({success: false, message: error.message});
    }
  }

  /*
    @response {
      success: true,
      appointmentEvent: {
        id,
        description,
        start,
        name, color
        end,
        slotInterval,
        slotCount,
       appointer: {
          fname,
          lname,
          id
        },
        appointments: Array<{
          id,
          start,
          end,
          position,
          appointmentEventId,
          appointee: {
            fname,
            lname,
            id
          }
        }>
      }
    }
  */
  async function getSpecificAppointmentEvent(req, res, next) {
    try {
      const appointmentEventId = req.params.id; assert.ok(appointmentEventId);
      
      const appointmentEvent = await usecase.getAppointmentEvent(appointmentEventId);
      const appointments = await usecase.getAppointmentsOfAppointmentEvent(appointmentEventId);
      const appointer = await usecase.getUser(appointmentEvent.appointerId);

      const ret = {
        id: appointmentEvent.id,
        description: appointmentEvent.description,
        start: appointmentEvent.start,
        end: appointmentEvent.end,
        slotInterval: appointmentEvent.slotInterval,
        slotCount: appointmentEvent.slotCount,
        name:  appointmentEvent.name,
        color:  appointmentEvent.color,
        appointer: {
          fname: appointer.fname,
          lname: appointer.lname,
          id: appointer.id
        },
        appointments: appointments
      };

      res.send({success: true, appointmentEvent: ret});
    } catch(error) {
      res.send({success: false, message: error.message});
    }
  }

  /*
    @response {
      success: true,
      appointment: {
        id,
        appointmentEventId,
        apointeeid,
        start,
        end,
        position,
        appointer: {
          id,
          fname,
          lname
        }
      }
    }
  */
  async function getSpecificAppointment(req, res, next) {
    try {
      const appointmentId = req.params.id; assert.ok(appointmentId);
      const appointment = await usecase.getAppointment(appointmentId);
      if (!appointment) return res.send({success: true, appointment: null});

      const appointer = await usecase.getAppointerOfAppointmentEvent(appointment.appointmentEventId);
      const ret = {
        ...appointment,
        appointer: {
          id: appointer.id,
          fname: appointer.fname,
          lname: appointer.lname
        }
      };

      res.send({ success: true, appointment: ret });
    } catch(error) {
      res.send({success: false, message: error.message});
    }
  }

  return {
    addAppointmentEvent,
    getAppointmentEvents,
    addAppointment,
    getSpecificAppointmentEvent,
    getSpecificAppointment
  };
}

// {
//   "start": "2019-10-13T03:00:00.000Z",
//   "end": "2019-10-13T04:00:00.000Z",
//   "name": "London Event",
//   "color": "fffeee",
//   "description": null,
//   "slotInterval": 10
// }