const assert = require('assert');
const constants = require('../constants');
const { READ, JOIN, UPDATE, UPDATE_JOIN } = constants.permissions.event;

class EventResourceAggregator {
  constructor() {

    //Array<{eventId: int, permission: 'UPDATE+JOIN' || 'READ' || 'UPDATE' || 'JOIN', resourceId: int}>
    this.resources_ = [];
  }

  /*
    @param events: Array<{permission: 'UPDATE'||'READ', resource: {eventId: int, permission: 'UPDATE'||'READ'||'JOIN', resourceId: int} }>
  */
  collect(events) {
    events.forEach(e => {
      const mResource = this.resources_.find(r => r.eventId === e.resource.eventId);
      if (!mResource) {
        //adding new event to the collection
        const permission = resolveWithSharedPermission(e.permission, e.resource.permission);
        const resource = e.resource; resource.permission = permission;
        this.resources_.push(resource);
      } else {
        //updating the existing event permission
        let permission = resolveWithSharedPermission(e.permission, e.resource.permission);
        permission = resolveWithEventPermission(permission, mResource.permission);
        mResource.permission = permission;
      }
    })
  }

  hasPermission(eventId, permission) {
    assert.ok(eventId); assert.ok([READ, JOIN, UPDATE, UPDATE_JOIN].indexOf(permission) >= 0);
    const r = this.resources_.find(r => r.eventId === eventId);
    if (!r) return false;
    switch(r.permission) {
      case UPDATE_JOIN: { return true; }
      case UPDATE: { return permission === UPDATE || permission === READ; }
      case JOIN: { return permission === JOIN || permission === READ; }
      case READ: { return permission === READ; }
      default: { return false; }
    }
  }

  getCollection() {
    return [...this.resources_];
  }
}

//@param pa: UPDATE || READ
//@param pb: UPDATE || JOIN || READ
function resolveWithSharedPermission(pa, pb) {
  return pa === READ? READ: pb;
}

//@param pa: UPDATE || JOIN || READ || UPDATE_JOIN
//@param pb: UPDATE || JOIN || READ || UPDATE_JOIN
function resolveWithEventPermission(pa, pb) {
  if (pa === READ) {

    //READ is lowest priority, whatever's on pb would be good
    return pb;
  } else if (pa === JOIN) {

    if (pb === READ) return JOIN;
    if (pb === JOIN) return JOIN;
    return UPDATE_JOIN;    
  } else if (pa === UPDATE) {

    if (pb === READ) return UPDATE;
    if (pb === UPDATE) return UPDATE;
    return UPDATE_JOIN;
  }
  return UPDATE_JOIN;
}

module.exports = EventResourceAggregator;