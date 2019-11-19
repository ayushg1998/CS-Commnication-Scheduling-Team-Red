const assert = require('assert');
const constants = require('../constants');
const { READ, JOIN, UPDATE, UPDATE_JOIN } = constants.permissions.appointmentEvent;

/*
  To figure out what exact permissions, a user has on a resource, 
  resources and group_resource_permissions would have to be expanded
  exhaustively. While doing so, it may happen, that user is permitted
  to a resource in multiple ways. Now, these possibly conflicting 
  permissions are resolved by this class. The `resources_` array would
  hold array of resources. The `collect(apEvents)` method takes in appointment
  events(array of resource) as argument. If any of the resource, has already apppeared earlier
  in `resources_` array, then the permission are updated. How they are updated? see
  resolveWithEventPermission function. If any of the resource, has not appeared earlier,then
  they are simply collectd, see `A` in code below. Each elements in `apEvents` array has (permisson: string) field and
  (resource: { ..., permission: string, ...}). The outer `permission` field is the maximum permission
  the resource may have. This may ofcourse change later when the same resource with different appear later.
  The inner `resource.permission` is the requested permissions. If the the resource has appeared earlier,
  then the conflicting permissions are resolved, such that maximum of the permissions are accepted, see `B`.

  All the `collectors` passed to `getAccessibleResources` function similarly

  ALERT: this is a comment only author might understand. lol.
*/
class AppointmentEventResourceAggregator {
  constructor() {

    //Array<{appointmentEventId: int, permission: 'UPDATE+JOIN' || 'READ' || 'UPDATE' || 'JOIN', resourceId: int}>
    this.resources_ = [];
  }

  /*
    @param events: Array<{permission: 'UPDATE'||'READ', resource: {appointmentEventId: int, permission: 'UPDATE'||'READ'||'JOIN', resourceId: int} }>
  */
  collect(apEvents) {
    apEvents.forEach(ape => {
      const mResource = this.resources_.find(r => r.appointmentEventId === ape.resource.appointmentEventId);
      if (!mResource) {
        //A
        //adding new appointmentEvent to the collection
        const permission = resolveWithSharedPermission(ape.permission, ape.resource.permission);
        const resource = ape.resource; resource.permission = permission;
        this.resources_.push(resource);
      } else {
        //B
        //updating the existing appointmentEvent permission
        let permission = resolveWithSharedPermission(ape.permission, ape.resource.permission);
        permission = resolveWithAppointmentEventPermission(permission, mResource.permission);
        mResource.permission = permission;
      }
    })
  }

  hasPermission(appointmentEventId, permission) {
    assert.ok(appointmentEventId); assert.ok([READ, JOIN, UPDATE, UPDATE_JOIN].indexOf(permission) >= 0);
    const r = this.resources_.find(r => r.appointmentEventId === appointmentEventId);
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

//@param pa, UPDATE || READ, maximum permission allowed
//@param pb, UPDATE || JOIN || READ, requested permission
function resolveWithSharedPermission(pa, pb) {
  return pa === READ? READ: pb;
}

//@param pa, UPDATE || JOIN || READ || UPDATE_JOIN, permission for event resource
//@param pb, UPDATE || JOIN || READ || UPDATE_JOIN, permission for event resource
//@return Max_permission(pa, pb). Note, when pa is UPDATE, and pb is JOIN or viceversa,
//returned permission would be UPDATE_JOIN.
function resolveWithAppointmentEventPermission(pa, pb) {
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

module.exports = AppointmentEventResourceAggregator;