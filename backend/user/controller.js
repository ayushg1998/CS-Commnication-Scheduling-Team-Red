const assert = require('assert');

module.exports = function(usecase) {

  /*
    @response {
      success: true,
      faculties: Array<{id, fname, lname, email, cwid}> 
    }
  */
  async function getFaculties(req, res, next) {
    try {
      let faculties = await usecase.getFaculties();
      faculties = faculties.map(f => ({
        id: f.id,
        fname: f.fname,
        lname: f.lname,
        email: f.email,
        cwid: f.cwid
      }));

      res.send({success: true, faculties});
    } catch(error) {
      res.send({success: false, message: error.message});
    }
  }

  async function addStudents(req, res, next) {
    try {
      
      res.send
    }
  }

  return {
    getFaculties
  }
}