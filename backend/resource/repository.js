const { USER, EVENT, APPOINTMENT_EVENT, APPOINTMENT, GROUP } = require('../constants').resourceTypes;
const { sqlUtils } = require('../lib');

module.exports = function(mysql) {

  /*
    @return Promise<{
      id, eventId, appointmentEventId,
      appointmentId, groupId, userId
    }>
  */
  function getResource(resourceId) {
    const sqv = sqlUtils.sqlValue;

    const query = `SELECT * from Resource WHERE id=${sqv(resourceId)}`;

    return new Promise((resolve, reject) => {
        
      mysql.query(query, function(err, rows){
        if (err) {reject(err); return;}
        if (!rows.length) { resolve(null); return;}
        resolve(rows[0]);
      });
    });
  }

  /*
    @param groupIds: Array<int>
    @return Promise<Array<{groupId, resources: Array<{userId: int, permission: string, resourceId: int}>}>>
  */
  function getUserResourcesOfGroups(groupIds) {
    if (!groupIds.length) return Promise.resolve([]);

    const query = `SELECT URP.groupId,R.userId,URP.permission,URP.resourceId FROM UserGroup_Resource_Permission URP 
      JOIN Resource R ON R.id=URP.resourceId
      WHERE URP.groupId IN ${sqlUtils.sqlLikeArray(groupIds)} AND R.userId IS NOT NULL
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
                  userId: row.userId,
                  permission: row.permission,
                  resourceId: row.resourceId                  
                }]
              });
              currentGroupId = row.groupId;
            }
            else {
              result[result.length - 1].resources.push({
                userId: row.userId,
                permission: row.permission,
                resourceId: row.resourceId
              });
            }
          });

          resolve(result); 
        });
      }); 
    
  }

  function getUserResourceOfUser(userId) {
    const query = `SELECT userId, id from Resource where userId=${userId}`;

    return new Promise((resolve, reject) => {
      mysql.query(query, function(err, rows){
        if (err) {reject(err); return;}
        if (!rows.length) { resolve(null); return;}

        resolve(rows[0]);
      });
    });
  }

  //[{userId, groups: Array<{id: int}>}]
  function getGroupsOfUsers(userIds) {
    if (!userIds.length) return Promise.resolve([]);

    const query = `SELECT userId, groupId FROM User_UserGroup
      WHERE userId IN ${sqlUtils.sqlLikeArray(userIds)}
      ORDER BY userId`;

    return new Promise((resolve, reject) => {
      mysql.query(query, function(err, rows){
        if (err) {reject(err); return;}
        if (!rows.length) { resolve([]); return;}

        const result = []; let currentUserId = -1;
        rows.forEach(row => {
          if (currentUserId != row.userId) {
            result.push({userId: row.userId, groups: [{ id: row.groupId }]});
            currentUserId = row.userId;
          }
          else {
            result[result.length - 1].groups.push({id: row.groupId});
          }
        });

        resolve(result); 
      });
    });
  }

  //@return Promise<int>
  function addResource(resourceId, TYPE) {
    let eventId = appointmentEventId = appointmentId = groupId = userId = null;
    
    switch(TYPE) {
      case USER: { userId = resourceId; } break;
      case EVENT: { eventId = resourceId; } break;
      case APPOINTMENT_EVENT: { appointmentEventId = resourceId; } break;
      case APPOINTMENT: { appointmentId = resourceId; } break;
      case GROUP: { groupId = resourceId; } break;
      default: { throw new Error('Resource Type mismatch'); }
    }

    const query = `INSERT INTO Resource (eventId, appointmentEventId, appointmentId, groupId, userId)
      VALUES(${eventId}, ${appointmentEventId}, ${appointmentId}, ${groupId}, ${userId})`;

    return new Promise(function(resolve, reject){
      mysql.query(query, async function(err, result) {
        if (err) { reject(err); return; }
        resolve(result.insertId);
      });
    });
  }

  function addUserResource(userId) {
    return addResource(userId, USER);
  }

  function addGroupResource(groupId) {
    return addResource(groupId, GROUP);
  }

  function addEventResource(eventId) {
    return addResource(eventId, EVENT);
  }

  function addAppointmentEventResource(appointmentEventId) {
    return addResource(appointmentEventId, APPOINTMENT_EVENT);
  }

  function addAppointmentResource(appointmentId) {
    return addResource(appointmentId, APPOINTMENT);
  }

  //@return Promise<int>
  function addResourcePermissionToUserGroup({groupId, resourceId, permission}) {
    const query = `INSERT INTO UserGroup_Resource_Permission (groupId, resourceId, permission)
      VALUES ${sqlUtils.sqlValues([groupId, resourceId, permission])};`

      return new Promise(function(resolve, reject){
        mysql.query(query, async function(err, result) {
          if (err) { reject(err); return; }
          resolve(result.insertId);
        });
      });
  }

  /*
    NOTE: no way to know if update was success
  */  
  function updateResourcePermission({groupId, resourceId, permission}) {
    const sqv = sqlUtils.sqlValue;

    const query = `UPDATE UserGroup_Resource_Permission
      SET permission=${sqv(permission)}
      WHERE resourceId=${sqv(resourceId)} AND groupId=${sqv(groupId)};`;

    return new Promise(function(resolve, reject){
      mysql.query(query, async function(err) {
        if (err) { reject(err); return; }
        resolve();
      });
    });
  }

  function getDirectPermissionOfGroupOnResource({groupId, resourceId}) {
    const sqv = sqlUtils.sqlValue;

    const query = `SELECT * FROM UserGroup_Resource_Permission
      WHERE groupId=${sqv(groupId)} AND resourceId=${sqv(resourceId)}`;

      return new Promise((resolve, reject) => {
        
        mysql.query(query, function(err, rows){
          if (err) {reject(err); return;}
          if (!rows.length) { resolve(null); return;}
          resolve(rows[0].permission);
        });
      });
  }

  return {
    getResource,
    getUserResourcesOfGroups,
    getUserResourceOfUser,
    getGroupsOfUsers,
    addUserResource,
    addGroupResource,
    addEventResource,
    addAppointmentEventResource,
    addAppointmentResource,
    addResourcePermissionToUserGroup,
    updateResourcePermission,
    getDirectPermissionOfGroupOnResource
  };
}