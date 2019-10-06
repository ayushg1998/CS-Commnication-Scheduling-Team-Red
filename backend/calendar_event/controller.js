const assert = require('assert');
const constants = require('../constants');

/*
**** for faculty ****
@response {
  success: true,
  data: {
    appointmentEvents: [{start, end, id, description }],
    events: [{start, end, name, id}],
    type: 'faculty'
  }
}

**** for student ****
@response {
  success: true,
  data: {
    appointments: [{start, end, description, id, appointer: { fname, lname, id } }],
    events: [{start, end, name, id}],
    type: 'student'
  }
}
*/
module.exports = function(usecase) {
  async function getCalendarEvents(req, res, next) {
    try {
      const userId = req.user.id;
      const userType = req.user.userType;
  
      let ret;
      if (userType === constants.USERTYPE_STUDENT) {
        ret = await usecase.getStudentCalendarEvents(userId);
      } else if (userType === constants.USERTYPE_FACULTY) {
        ret = await usecase.getFacultyCalendarEvents(userId);
      }
      ret.type = userType;

      res.send({success: true, data: ret});
    } catch(error) {
      res.send({success: false, message: error.message});
    }
  }

  return {
    getCalendarEvents
  };
};