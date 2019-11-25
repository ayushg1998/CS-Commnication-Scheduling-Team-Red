const assert = require('assert');
const lib = require('../lib');
const constants = require('../constants');
const {UPDATE, READ} = constants;

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
  
    const user = await repository.createUser({cwid, username, email, loginToken, password, fname, lname, userType: constants.USERTYPE_STUDENT});

    await repository.addUserResource(user.id);

    const groupId = await (async function() {
      const groupName = fname +' solo group';
      return repository.createGroup({name: groupName, description: null, creatorId: null});
    })();
    
    await repository.addGroupMember({userId: user.id, groupId});
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
  
    const user = await repository.createUser({cwid, username, email, loginToken, password, fname, lname, userType: constants.USERTYPE_FACULTY});

    await repository.addUserResource(user.id);

    const groupId = await (async function() {
      const groupName = fname +' solo group';
      return repository.createGroup({name: groupName, description: null, creatorId: null});
    })();
    
    await repository.addGroupMember({userId: user.id, groupId});
  }

  async function loginByUsername(username, pwd) {
    assert.ok(username); assert.ok(pwd);
    
    const user = await repository.findUserByUsername(username);
    if (!user) return 0;
    if (user.password !== pwd) return 1;

    return user;
  }

  /*@return Promise<{
    insertedCwids: Array<string>,
    existingCwids: Array<string>
  }>
  */
  async function addStudentsAsCsv(csv) {
    assert.ok(csv);
    const { csvParser, username: usernameUtils, password: passwordUtils } = lib;
    
    //1. parse, which returns
    //Array<{email: string, cwid: number, fname: string, lname: string}>
    let students = csvParser.parseUsersFromCsv(csv);

    const cwids = students.map(s => s.cwid);
    const existingCwids = await (async function() {
      const users = await repository.getUsersByCwids(cwids);
      return users.map(u => u.cwid);
    })();
    
    //2. filter only those students that need be inserted
    students = students.filter(s => existingCwids.indexOf(s.cwid) < 0);
    const toBeInsertedCwids = students.map(s => s.cwid);
      
    //3. add more fields, and prepare for insertion
    students = students.map(s => {
      const username = usernameUtils.parseUsernameFromEmail(s.email);
      const password = passwordUtils.createPasswordFromUsername(username);

      return { ...s, username, password }
    });
    
    //4. insert 
    //TODO: make bulk insertion instead, this way is slower
    await Promise.all(students.map(s => registerStudent(s))).catch(err => { console.log(err.message); });

    //5. some insertions may have failed; this way we report correct inserted Cwids
    const insertedCwids = await (async function() {
      const users = await repository.getUsersByCwids(toBeInsertedCwids);
      return users.map(u => u.cwid);
    })();
    
    return { insertedCwids, existingCwids };
  }


  return {
    registerStudent,
    registerFaculty,
    loginByUsername,
    addStudentsAsCsv
  }
}