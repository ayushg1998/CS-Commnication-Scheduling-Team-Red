const assert = require('assert');
const { sqlUtils } = require('../lib');

module.exports = function(mysql, {userRepository, resourceRepository}) {

  async function createGroup({name, description, creatorId}) {
    const query = `INSERT INTO UserGroup (name, description, creatorId)
      VALUES ${sqlUtils.sqlValues([name, description, creatorId])};`;

    return new Promise((resolve, reject) => {
      mysql.query(query, (err, result) => {
          if (err) { reject(err); return; }
          resolve(result.insertId);
      });            
    });
  }

  async function addGroupMember({userId, groupId}) {
    const query = `INSERT INTO User_UserGroup (userId,  groupId)
      VALUES ${sqlUtils.sqlValues([userId, groupId])}`;

      return new Promise((resolve, reject) => {
        mysql.query(query, (err, result) => {
            if (err) { reject(err); return; }
            resolve(result.insertId);
        });            
      });
  }

  return {
    createUser: userRepository.createUser,
    findUserByCWID: userRepository.findUserByCWID,
    getUsersByCwids: userRepository.getUsersByCwids,
    findUserByUsername: userRepository.findUserByUsername,
    addUserResource: resourceRepository.addUserResource,
    createGroup,
    addGroupMember
  };
}