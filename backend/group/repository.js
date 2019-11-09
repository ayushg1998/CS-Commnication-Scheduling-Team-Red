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

  function getGroupResourcesOfGroups(groupIds) {
    if (!groupIds.length) return Promise.resolve([]);

    const query = `
      SELECT URP.groupId,URP.permission,URP.resourceId,R.groupId as resourceGroupId FROM UserGroup_Resource_Permission URP
      JOIN Resource R ON R.id=URP.resourceId
      WHERE URP.groupId IN ${sqlUtils.sqlLikeArray(groupIds)} AND R.groupId IS NOT NULL
      ORDER BY URP.groupId;`;
    
      return new Promise((resolve, reject) => {
        
        mysql.query(query, function(err, rows){
          if (err) {reject(err); return;}
          if (!rows.length) { resolve([]); return;}
  
          const result = []; let currentGroupId = -1;
          rows.forEach(row => {
            if (currentGroupId != row.groupId) {
              result.push({
                groupId: row.groupId,
                resources: [{
                  groupId: row.resourceGroupId,
                  permission: row.permission,
                  resourceId: row.resourceId                  
                }]
              });
              currentGroupId = row.groupId;
            }
            else {
              result[result.length - 1].resources.push({
                groupId: row.resourceGroupId,
                permission: row.permission,
                resourceId: row.resourceId
              });
            }
          });
  
          resolve(result); 
        });
      });
  }

  return {
    createGroup,
    addGroupMember,
    getGroupResourcesOfGroups
  };
}