const assert = require('assert');
const moment = require('moment-timezone'); moment.tz.setDefault('utc');
const { sqlUtils } = require('../lib');
const sqv = sqlUtils.sqlValue;

module.exports = function(mysql, {resourceRepository, userRepository}) {
  assert.ok(resourceRepository); assert.ok(userRepository);
  /*
    @param groupIds: Array<int>
    @return Array<{eventId, permission, resourceId}>
  */
  function getEventResourcesOfGroups(groupIds) {
    if (!groupIds.length) return Promise.resolve([]);

    const query = `SELECT URP.groupId,URP.permission,URP.resourceId,R.eventId FROM UserGroup_Resource_Permission URP 
      JOIN Resource R ON R.id=URP.resourceId
      WHERE URP.groupId IN ${sqlUtils.sqlLikeArray(groupIds)} AND R.eventId IS NOT NULL
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
                  eventId: row.eventId,
                  permission: row.permission,
                  resourceId: row.resourceId                  
                }]
              });
              currentGroupId = row.groupId;
            }
            else {
              result[result.length - 1].resources.push({
                eventId: row.eventId,
                permission: row.permission,
                resourceId: row.resourceId
              });
            }
          });
  
          resolve(result); 
        });
      }); 
  }

  function addEvent({name, description, image, start, end, color, creatorId, groupId}) {
    const query = `INSERT INTO Event (name, description, image, start, end, color, creatorId, groupId)
    VALUES ${sqlUtils.sqlValues([name, description, image, start, end, color, creatorId, groupId])};`;

    return new Promise((resolve, reject) => {
      mysql.query(query, (err, result) => {
          if (err) { reject(err); return; }
          resolve(result.insertId);
      });            
    });
  }

  function updateEvent(eventId, {name, description, image, start, end, color}) {
    const sqv = sqlUtils.sqlValue;    

    const setParam = `SET name=${sqv(name)},description=${sqv(description)},image=${sqv(image)},
    start=${sqv(start)},end=${sqv(end)},color=${sqv(color)}`;    
    const query = `UPDATE Event ${setParam} WHERE id=${eventId};`;

    return new Promise((resolve, reject) => {
      mysql.query(query, err => {
          if (err) { reject(err); return; }
          resolve();
      });            
    });
  }

  /*
  @return Promise<{
    id: int,
    name: null | string,
    description: null | string,
    image: null | string,
    start: moment,
    end: moment,
    color: string,
    creatorId: int,
    groupId: int
  }>
  */
  function getEvent(eventId) {
    const query = `SELECT * FROM Event WHERE id=${eventId}`;

    return new Promise((resolve, reject) => {        
      mysql.query(query, function(err, rows){
        if (err) {reject(err); return;}
        if (!rows.length) { resolve(null); return;}
        resolve(fromDBEvent(rows[0]));
      });
    });
  }

    /*
  @return Promise<Array<{
    id: int,
    name: null | string,
    description: null | string,
    image: null | string,
    start: moment,
    end: moment,
    color: string,
    creatorId: int,
    groupId: int
  }>>
  */
  function getEvents(ids) {
    if (!ids.length) return Promise.resolve([]);

    const query = `SELECT * FROM Event WHERE id IN ${sqlUtils.sqlValues(ids)};`;

    return new Promise(function(resolve, reject){
      mysql.query(query, function(err, rows){
          if (err) {reject(err); return;}
          if (!rows.length) { resolve([]); return;}
          resolve(rows);
      });
    });
  }

  /*
    @return Promsise<{
      eventId: int,
      id: int
    }>, whose groupId matches
  */
 function getEventResource(eventId) {
  const query = `SELECT * FROM Resource
    WHERE eventId=${sqv(eventId)};`

    return new Promise((resolve, reject) => {
    
      mysql.query(query, function(err, rows) {
        if (err) {reject(err); return;}
        if (!rows.length) { resolve(null); return;}
        resolve(rows[0])
      });
    });      
  }

  return {
    getEventResourcesOfGroups,
    addEvent,
    updateEvent,
    getEvent,
    addEventResource: resourceRepository.addEventResource,
    getSoloGroupOfUser: userRepository.getSoloGroupOfUser,
    getEvents,
    getEventResource,
  };
}

function fromDBEvent(e) {
  return {
    ...e,
    start: moment(e.start),
    end: moment(e.end)
  };
}