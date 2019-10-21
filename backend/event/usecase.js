const assert = require('assert');
const moment = require('moment');
const { READ, JOIN, UPDATE, UPDATE_JOIN } = require('../constants').permissions.event;
const EventResourceAggregator = require('./collector');

module.exports = function(repository, {resourceUsecase}) {
  assert.ok(resourceUsecase);
  /*
    @return Promise<Array<{
      eventId: int, 
      permission: 'UPDATE+JOIN' || 'READ' || 'UPDATE' || 'JOIN', 
      resourceId: int
    }>>
  */
  async function getAllVisibleEventsOfUser(userId) {
    const collector = new EventResourceAggregator();
    const fetcher = {fetch: repository.getEventResourcesOfGroups};

    await resourceUsecase.getAccessibleResources(userId, collector, fetcher);
    return collector.getCollection();
  }

  //TODO: sql transaction for these series of inserts
  //TODO: permission may be join later
  async function addEvent(event) {
    let {name, description, image, start, end, color, creatorId, groupId} = event;
    assert.ok(color); assert.ok(creatorId); assert.ok(groupId); assert.ok(start); assert.ok(end);

    start = moment(start).toISOString(); end = moment(end).toISOString();   

    const eventId = await repository.addEvent({name, description, image, start, end, color, creatorId, groupId});

    const resourceId = await repository.addEventResource(eventId);

    //give join permission to members of group
    await repository.addResourcePermissionToUserGroup({groupId, resourceId, permission: JOIN});

    //give update permission to creator of group
    const creatorGroup = await repository.getSoloGroupOfUser(creatorId);
    await repository.addResourcePermissionToUserGroup({groupId: creatorGroup.id, resourceId, permission: UPDATE});
  }

  async function updateEvent({eventId, userId, event}) {
    assert.ok(eventId); assert.ok(userId);
    const bool = await hasPermission({eventId, userId, permission: UPDATE});
    if (!bool) throw new Error('Not permitted');

    let {name, description, image, start, end, color} = event;
    start = moment(start); end = moment(end);

    const event_ = await repository.getEvent(eventId);
    if (!event_) throw new Error('Event not found');

    await repository.updateEvent(eventId, {name, description, image, start, end, color});
  }

  async function hasPermission({eventId, userId, permission}) {
    assert.ok(eventId); assert.ok(userId);
    assert.ok([READ, JOIN, UPDATE, UPDATE_JOIN].indexOf(permission) >= 0);

    const collector = new EventResourceAggregator();
    const fetcher = {fetch: repository.getEventResourcesOfGroups};

    await resourceUsecase.getAccessibleResources(userId, collector, fetcher);
    return collector.hasPermission(eventId, permission);
  }

  return {
    getAllVisibleEventsOfUser,
    addEvent,
    updateEvent,
    hasPermission
  }
}

