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
        appointerId,
        permission (for flag based queries)
      }>
    }
  */
  async function getAppointmentEvents(req, res, next) {
    try {
      const queryFilters = req.query.filters || [];
      const joinableFlag  = queryFilters.indexOf('joinable') >= 0;
      const allVisibleFlag  = queryFilters.indexOf('all_visible') >= 0;
      const userId = parseInt(req.user.id);

      let appointmentEvents;
      if (allVisibleFlag) {
        appointmentEvents = await usecase.getAllVisibleAppointmentEventsOfUser(userId);
      }
      else if (joinableFlag) {
        appointmentEvents = await usecase.getAllJoinableAppointmentEventsOfUser(userId);
      }
      else {
        appointmentEvents = await usecase.getAppointmentEventsOfAppointer(userId);
      }

      res.send({success: true, appointmentEvents});
    } catch(error) {
      res.send({success: false, message: error.message});
    }
  }

  async function shareAppointmentEvent(req, res, next) {
    try {
      const appointmentEventId = req.body.appointmentEventId;
      const permission = req.body.permission;
      const sharerId = req.user.id;
      const shareeId = req.body.userId;

      await usecase.shareAppointmentEventWithUser({
        sharerId, shareeId, permission, appointmentEventId});

      res.send({success: true});
    }
    catch(err) {
      res.send({success: false, message: err.message});
    }
  }


  
  /*
    @body {
     position
     appointmentEventId
    }

    @response {
      success: true,
      appointmentId
    }
  */
  async function addAppointment(req, res, next) {
    try {
      const appointeeId = req.user.id;
      const {position, appointmentEventId} = req.body;

      const appointmentId = await usecase.addAppointment({position, appointmentEventId, appointeeId});
      res.send({success: true, appointmentId });
    } catch(error) {
      res.send({success: false, message: error.message});
    }
  }

  /*
    @body {
      appointmentId, 
      position
    }
    
    @response {
      success: true
    }
  */
  async function changeAppointment(req, res, next) {
    try {
      const userId = req.user.id;
      const appointmentId = parseInt(req.params.id);
      const {position} = req.body;

      await usecase.changeAppointment({userId, appointmentId, position});
      res.send({ success: true });
    } catch(error) {
      res.send({success: true, message: error.message});
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
    get appointments, user is part of
  */
  async function getAppointments(req, res, next) {
    const userId = req.user.id;
    const appointments = await usecase.getAppointmentsOfAppointee(userId);
    res.send({success: true, appointments});
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
    changeAppointment,
    getSpecificAppointmentEvent,
    shareAppointmentEvent,
    getSpecificAppointment,
    getAppointments
  };
}