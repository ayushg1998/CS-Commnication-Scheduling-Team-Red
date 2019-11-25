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
  async function getAllVisibleEventResourcesOfUser(userId) {
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
    await resourceUsecase.addResourcePermissionToUserGroup({groupId, resourceId, permission: JOIN});

    //give update permission to creator of group
    const creatorGroup = await repository.getSoloGroupOfUser(creatorId);
    await resourceUsecase.addResourcePermissionToUserGroup({groupId: creatorGroup.id, resourceId, permission: UPDATE});
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

  async function getAllVisibleEventsOfUser({userId}) {
    assert.ok(userId);

    const eventResources = await getAllVisibleEventResourcesOfUser(userId);
    const eventIds = eventResources.map(e => e.eventId);
    const events = await repository.getEvents(eventIds);

    return events.map(e => {
      const permission = eventResources.find(er => er.eventId === e.id).permission;
      e.permission = permission; return e;
    });
  }


  async function shareEventWithUser({sharerId, shareeId, eventId, permission}) {
    assert.ok(sharerId); assert.ok(shareeId); assert.ok(eventId);
    assert.ok(resourceUsecase.checkPermissionCompatible({eventId}, permission));

    //sharer should atlest have permission that he attempts to share
    const sharerHasPermission = await hasPermission({userId: sharerId, eventId, permission});
    if (!sharerHasPermission)
      throw new Error('Sharer does not have sufficient permission, to grant the permission');
    
    const resource = await repository.getEventResource(eventId);

    const group = await repository.getSoloGroupOfUser(shareeId);

    await resourceUsecase.addResourcePermissionToUserGroup({
      groupId: group.id,
      resourceId: resource.id, permission});
  }


  return {
    getAllVisibleEventResourcesOfUser,
    addEvent,
    updateEvent,
    hasPermission,
    getAllVisibleEventsOfUser,
    shareEventWithUser
  }
}