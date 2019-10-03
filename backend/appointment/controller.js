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
      appointerId,
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
      res.send({success: true, message: 'getSpecificAppointmentEvent'});
    } catch(error) {
      res.send({success: false, message: error.message});
    }
  }

  async function getSpecificAppointment(req, res, next) {
    try {
      res.send({success: true, message: 'getSpecificAppointment'});
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