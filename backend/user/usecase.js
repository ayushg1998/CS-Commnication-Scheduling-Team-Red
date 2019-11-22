const assert = require('assert');
const { validateFormat, loginToken, password }= require('../lib');

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

  async function addStudents(students) {
    students = students.filter(s => {
      s.fname &&
      s.lname &&
      validateFormat.checkUsername(s.username) &&
      validateFormat.checkStudentEmail(s.email) &&
      validateFormat.checkCWID(s.cwid)
    });

    
    const users = await repository.getUsersByCwids(cwids);
    const usedCwids = new Set(users.map(u => u.cwid));
    const users2 = await repository.getUsersByStudent(usernames);
    const usedUsernames = new Set(users2.map(u => u.username));
    
    students = students
      .filter(s => !usedCwids.has(s.cwid))
      .filter(s => !usedUsernames.has(s.username));
      
    students = students.map(s => {
      return {
        ...s,
        userType: 'student',
        loginToken: loginToken.createLoginToken(),
        password: password.createRandomPassword()
      }
    });
    
    repository.createUsers(students);
  }
  
  return {
    getFaculties,
    getStudents
  };
}
