const assert = require('assert');

module.exports = function(usecase) {

  /*
    @response {
      success: true,
      faculties: Array<{id, fname, lname, email}> 
    }
  */
  async function getFaculties(req, res, next) {
    try {
      let faculties = await usecase.getFaculties();
      faculties = faculties.map(f => ({
        id: f.id,
        fname: f.fname,
        lname: f.lname,
        email: f.email
      }));

      res.send({success: true, faculties});
    } catch(error) {
      res.send({success: false, message: error.message});
    }
  }

  return {
    getFaculties
  }
}