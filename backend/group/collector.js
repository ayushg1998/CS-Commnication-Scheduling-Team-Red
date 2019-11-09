const assert = require('assert');
const constants = require('../constants');
const { READ, UPDATE } = constants.permissions.group;

class GroupResourceAggregator {
  constructor() {

    //Array<{groupId: int, permission: 'READ' || 'UPDATE', resourceId: int}>
    this.resources_ = [];
  }

  /*
    @param groups: Array<{
      permission: 'UPDATE'||'READ', 
      resource: {groupId: int, permission: 'UPDATE'||'READ', resourceId: int} }>
  */
  collect(groups) {
    groups.forEach(g => {
      const mResource = this.resources_.find(r => r.groupId === g.resource.groupId);
      if (!mResource) {
        //adding new group to the collection
        const permission = resolveWithSharedPermission(g.permission, g.resource.permission);
        const resource = g.resource; resource.permission = permission;
        this.resources_.push(resource);
      } else {
        //updating the existing group permission
        let permission = resolveWithSharedPermission(g.permission, g.resource.permission);
        permission = resolveWithGroupPermission(permission, mResource.permission);
        mResource.permission = permission;
      }
    })
  }

  hasPermission(groupId, permission) {
    assert.ok(groupId); assert.ok([READ, UPDATE].indexOf(permission) >= 0);
    const r = this.resources_.find(r => r.groupId === groupId);
    if (!r) return false;
    switch(r.permission) {
      case UPDATE: { return true; }
      case READ: { return permission === READ; }
      default: { return false; }
    }
  }

  getCollection() {
    return [...this.resources_];
  }
}

//@param pa, UPDATE || READ, maximum permission allowed
//@param pb, UPDATE || READ, requested permission
function resolveWithSharedPermission(pa, pb) {
  return pa === READ? READ: pb;
}

//resolves to highest permission among two
function resolveWithGroupPermission(pa, pb) {
  if (pa === READ) {

    //READ is lowest priority, whatever's on pb would be good
    return pb;
  }

  return UPDATE;
}

module.exports = GroupResourceAggregator;