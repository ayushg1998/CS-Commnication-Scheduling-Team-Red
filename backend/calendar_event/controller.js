const assert = require('assert');
const constants = require('../constants');

/*
**** for faculty ****
@response {
  success: true,
  data: {
    appointmentEvents: [{start, end, id, name, color, permission }],
    events: [{start, end, name, color, id, permission}],
    type: 'faculty'
  }
}

**** for student ****
@response {
  success: true,
  data: {
    appointments: [{start, end, id, name, color, appointer: { fname, lname, id } }],
    events: [{start, end, name, id, color}],
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
        //ret = await usecase.getStudentCalendarEvents(userId);
        res.send({success: false, message: 'Only faculties for now'});
      } else if (userType === constants.USERTYPE_FACULTY) {
        ret = await usecase.getFacultyCalendarEvents(userId);
      }
      ret.type = userType;

      res.send({success: true, data: ret});
    } catch(error) {
      res.send({success: false, message: error.message});
    }
  }

  /*
    @body {
      userId: int, id of the sharee
    }
    @response {
      success: true
    }
  */
  async function shareCalendarWithUser(req, res, next) {
    try {
      const sharerId = req.user.id;
      const shareeId = req.body.userId;

      await usecase.shareCalendar(sharerId, shareeId);
      res.send({success: true});
    } catch(error) {
      res.send({success: false, message: error.message});
    }
  }

  return {
    getCalendarEvents,
    shareCalendarWithUser
  };
};