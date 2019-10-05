module.exports = function(usecase) {

  //teseted
  /*
    body: {
      start,
      end,
      slotInterval,
      description
    }
  */
  async function addAppointmentEvent(req, res, next) {
    try {
      const {start, end, slotInterval, description} = req.body;
      const appointerId = req.user.id;

      await usecase.addAppointmentEvent({start, end, slotInterval, description, appointerId});
      res.send({success: true});
    } catch(error) {
      res.send({success: false, message: error.message});
    }
  }

  //TODO: test
  //TODO: if no appointment events, should be [] instead of null
  /*
    query: {
      appointerId
    }

    response: Array<{
      id,
      description,
      start,
      end,
      slotInterval,
      appointerId
    }>
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

  //TODO: test
  /*
    body: {
      position
      appointmentEventId
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

  //TODO: test
  /*
    rsponse: {
      id,
      description,
      start,
      end,
      slotInterval,
      slotCount,
      appointer: {
        fname,
        lname,
        id
      }
      appointments: Array<{
        id,
        start,
        end,
        position,
        appointee: {
          fname,
          lname,
          id
        }
      }>
    }
  */
  async function getSpecificAppointmentEvent(req, res, next) {
    try {
      const appointmentEventId = req.query.id; assert.ok(appointmentEventId);
      
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


  async function getSpecificAppointment(req, res, next) {
    try {
      const appointmentId = req.query.id; assert.ok(appointmentId);
      const appointment = await usecase.getAppointment(appointmentId);
      if (!appointment) return res.send({success: true, appointment: null});

      const appointer = await usecase.getAppointerOfAppointmentEvent(appointment.appointmentEventId);
      const ret = {
        ...appointment,
        appointer: {
          fname: appointer.id,
          lname: appointer.fname,
          id: appointer.id
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