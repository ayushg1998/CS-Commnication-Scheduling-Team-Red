const assert = require('assert');
const lib = require('../lib');
const constants = require('./constants');

module.exports = function(repository) {
  async function registerStudent({cwid, username, email, password, fname, lname}) {
    assert.ok(cwid); assert.ok(username); assert.ok(email); assert.ok(password);
    assert.ok(fname); assert.ok(lname);
  
    const loginToken = lib.loginToken.createLoginToken();
  
    const isCWIDValid = lib.validateFormat.checkCWID(cwid);
    const isUsernameValid = lib.validateFormat.checkUsername(username);
    const isEmailValid = lib.validateFormat.checkStudentEmail(email);
    const isPasswordValid = lib.validateFormat.checkPassword(password);
    const isFnameValid = lib.validateFormat.checkFname(fname);
    const isLnameValid = lib.validateFormat.checkLname(lname);
  
    if (!isCWIDValid) return 0; 
    if (!isUsernameValid)  return 1; 
    if (!isEmailValid) return 2; 
    if (!isPasswordValid) return 3;
    if (!isFnameValid || !isLnameValid) return 4;
  
    return repository.createUser({cwid, username, email, loginToken, password, fname, lname, userType: constants.USERTYPE_STUDENT});
  }
  
  async function registerFaculty({cwid, username, email, password, fname, lname}) {
    assert.ok(cwid); assert.ok(username); assert.ok(email); assert.ok(password);
    assert.ok(fname); assert.ok(lname);
  
    const loginToken = lib.loginToken.createLoginToken();
  
    const isCWIDValid = lib.validateFormat.checkCWID(cwid);
    const isUsernameValid = lib.validateFormat.checkUsername(username);
    const isEmailValid = lib.validateFormat.checkFacultyEmail(email);
    const isPasswordValid = lib.validateFormat.checkPassword(password);
    const isFnameValid = lib.validateFormat.checkFname(fname);
    const isLnameValid = lib.validateFormat.checkLname(lname);
  
    if (!isCWIDValid) return 0; 
    if (!isUsernameValid)  return 1; 
    if (!isEmailValid) return 2; 
    if (!isPasswordValid) return 3;
    if (!isFnameValid || !isLnameValid) return 4;
  
    return repository.createUser({cwid, username, email, loginToken, password, fname, lname, userType: constants.USERTYPE_FACULTY});
  }

  async function loginByUsername(username, pwd) {
    assert.ok(username); assert.ok(pwd);
    
    const user = await repository.findUserByUsername(username);
    if (!user) return 0;
    if (user.password !== pwd) return 1;

    return user;
  }

  return {
    registerStudent,
    registerFaculty,
    loginByUsername
  }
}