module.exports = function(usecase) {

  async function addAppointmentEvent(req, res, next) {
    try {
      res.send({success: true, message: 'addAppointmentEvent'});
    } catch(error) {
      res.send({success: false, message: error.message});
    }
  }

  async function getAppointmentEvents(req, res, next) {
    try {
      res.send({success: true, message: 'getAppointmentEvents'});
    } catch(error) {
      res.send({success: false, message: error.message});
    }
  }

  async function addAppointment(req, res, next) {
    try {
      res.send({success: true, message: 'addAppointment'});
    } catch(error) {
      res.send({success: false, message: error.message});
    }
  }

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