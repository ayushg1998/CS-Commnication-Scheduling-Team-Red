const assert = require('assert');

module.exports = function(repository) {
  /*
    @return @see repository.getFaculties
  */
  async function getFaculties() {
    return repository.getFaculties();
  }

  /*
    @return @see repository.getStudents
  */
  async function getStudents() {
    return repository.getStudents();
  }
  
  return {
    getFaculties,
    getStudents
  };
}

//addStudents({csv}) insertedIds, existingIds,