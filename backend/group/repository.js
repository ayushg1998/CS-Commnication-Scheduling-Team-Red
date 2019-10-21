const assert = require('assert');
const moment = require('moment');
const { sqlUtils } = require('../lib');

module.exports = function(mysql) {

  async function createGroup({name, description, creatorId}) {
    const query = `INSERT INTO UserGroup (name, description, creatorId)
      VALUES ${sqlUtils.sqlValues([name, description, creatorId])}`;
    
    console.log(query);

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

      console.log(query);

      return new Promise((resolve, reject) => {
        mysql.query(query, (err, result) => {
            if (err) { reject(err); return; }
            resolve(result.insertId);
        });            
      });
  }

  return {
    createGroup,
    addGroupMember
  }
}