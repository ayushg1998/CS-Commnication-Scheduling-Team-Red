const assert = require('assert');
const moment = require('moment');
const { sqlUtils } = require('../lib');
const sqv = sqlUtils.sqlValue;

module.exports = function(mysql, {userRepository, resourceRepository}) {
  assert.ok(userRepository); assert.ok(resourceRepository);

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

  /*
    @return Promise<{
      id: number,
      name: string,
      description: string,
      creatorId: number
    }>
  */
  function getGroup(id) {
    const query = `SELECT * FROM UserGROUP WHERE id=${sqv(id)}`;

    return new Promise(function(resolve, reject){
      mysql.query(query, function(err, rows){
          if (err) {reject(err); return;}
          if (!rows.length) { resolve(null); return;}
          resolve(rows[0]);
      });
    });
  }

  /*
    @return Promise<Array<{
      id: number,
      name: string,
      description: string,
      creatorId: number
    }>>
  */
  function getGroups(groupIds) {
    if (!groupIds.length) return Promise.resolve([]);

    const query = `SELECT * FROM UserGROUP WHERE id IN ${sqlUtils.sqlValues(groupIds)}`;

    return new Promise(function(resolve, reject){
      mysql.query(query, function(err, rows){
          if (err) {reject(err); return;}
          if (!rows.length) { resolve([]); return;}
          resolve(rows);
      });
    });
  }

  /*
    @return Promise<number>
  */
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

  /*
    Promise<Array<{
      id: number,
      cwid: number,
      fname: string,
      lname: string,
      email: string
    }>>
  */
  function getGroupMembers(groupId) {
    const query = `SELECT userId FROM User_UserGroup WHERE groupId=${sqv(groupId)};`;

    return new Promise((resolve, reject) => {
        
      mysql.query(query, function(err, rows){
        if (err) {reject(err); return;}
        if (!rows.length) { resolve([]); return; }

        const userIds = rows.map(r => r.userId);

        const query2 = `SELECT id,cwid,fname,lname,email 
          FROM USER where 
          id IN ${sqlUtils.sqlValues(userIds)};`;

        mysql.query(query2, function(err, rows) {
          if (err) {reject(err); return;}
          resolve(rows);
        });
      });
    });
  }

  /*
    NOTE: no status of insertions are returned
    @return Promise<void>
  */
  function addGroupMembers(userIds, groupId) {
    if (!userIds.length) return Promise.resolve();

    const values = userIds.map(u => sqlUtils.sqlValues([u, groupId]))
      .join(',');

    const query = `INSERT INTO User_UserGroup(userId, groupId) VALUES ${values};`;

    return new Promise((resolve, reject) => {
        
      mysql.query(query, function(err, rows){
        if (err) {reject(err); return;}
        resolve();
      });
    });
  }

  /*
    NOTE: no status of removals are returned
    Promise<void>
  */
  function removeGroupMembers(userIds, groupId) {
    if (!userIds.length) return Promise.resolve();

    const query = `DELETE FROM User_UserGroup 
      WHERE groupId=${sqv(groupId)} AND userId IN ${sqlUtils.sqlValues(userIds)};`;

    return new Promise((resolve, reject) => {
      
      mysql.query(query, function(err) {
        if (err) {reject(err); return;}
        resolve();
      });
    });
  }

  /*
    NOTE: no status of update are returned
    Promise<void>
  */
  function updateGroup({groupId, name, description}) {
    const query = `UPDATE UserGroup
      SET name=${sqv(name)},description=${sqv(description)}
      WHERE id=${sqv(groupId)};`;

      return new Promise((resolve, reject) => {
      
        mysql.query(query, function(err) {
          if (err) {reject(err); return;}
          resolve();
        });
      });      
  }

  /*
    @return Promsise<{
      groupId: int,
      id: int
    }>, whose groupId matches
  */
  function getGroupResource(groupId) {
    const query = `SELECT * FROM Resource
      WHERE groupId=${sqv(groupId)};`

      return new Promise((resolve, reject) => {
      
        mysql.query(query, function(err, rows) {
          if (err) {reject(err); return;}
          if (!rows.length) { resolve(null); return;}
          resolve(rows[0])
        });
      });      
  }

  /*
    @return Promise<Array<{
      id: number,
      name: string,
      description: string,
      creatorId: number
    }>>
  */
  function getGroupsOfCreator(creatorId) {
    const query = `SELECT * FROM UserGROUP WHERE creatorId=${sqv(creatorId)}`;

    return new Promise(function(resolve, reject){
      mysql.query(query, function(err, rows){
          if (err) {reject(err); return;}
          if (!rows.length) { resolve([]); return;}
          resolve(rows);
      });
    });
  }

  return {
    createGroup,
    addGroupMember,
    getGroupResourcesOfGroups,
    getSoloGroupOfUser: userRepository.getSoloGroupOfUser,
    getUsersByCwids: userRepository.getUsersByCwids,
    addGroupResource: resourceRepository.addGroupResource,
    getGroupMembers,
    addGroupMembers,
    removeGroupMembers,
    updateGroup,
    getGroup,
    getGroups,
    getGroupResource,
    getGroupsOfCreator
  };
}

