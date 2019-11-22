const assert = require('assert');
const { USERTYPE_STUDENT,  USERTYPE_FACULTY } = require('../constants');

module.exports = function(usecase) {

  /*
    @response {
      success: true,
      faculties: Array<{id, fname, lname, email, cwid}> 
    }
  */
  async function getUsers(req, res, next) {
    try {
      const filters = req.query.filters || [];
      const haveFaculty = filters.indexOf('faculty') >= 0;
      const haveStudent = filters.indexOf('student') >= 0;
      const haveNone = !haveFaculty && !haveStudent;

      if (haveNone) { 
        res.send({
          success: false, 
          message: '`filters` param expected with `faculty`,`student` as values'
        });
        return;      
      }

      let faculties = []; let students = [];
      if (haveFaculty) {
        faculties = await usecase.getFaculties();
        faculties = faculties.map(f => ({
          id: f.id,
          fname: f.fname,
          lname: f.lname,
          email: f.email,
          cwid: f.cwid,
          userType: USERTYPE_FACULTY
        }));
      }
      if (haveStudent) {
        students = await usecase.getStudents();
        students = students.map(s => ({
          id: s.id,
          fname: s.fname,
          lname: s.lname,
          email: s.email,
          cwid: s.cwid,
          userType: USERTYPE_STUDENT
        }));
      }

      res.send({success: true, users: [...faculties, ...students ]});
    } catch(error) {
      res.send({success: false, message: error.message});
    }
  }

  // async function addStudents(req, res, next) {
  //   try {
      
  //     res.send
  //   }
  // }

  return {
    getUsers
  }
}