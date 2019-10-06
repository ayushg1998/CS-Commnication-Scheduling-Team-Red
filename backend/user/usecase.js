const assert = require('assert');

module.exports = function(repository) {
  /*
    @return @see repository.getFaculties
  */
  async function getFaculties() {
    return repository.getFaculties();
  }
  
  return {
    getFaculties
  };
}
