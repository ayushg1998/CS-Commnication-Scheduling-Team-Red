const assert = require('assert');
const constants = require('../constants');
const { READ, UPDATE } = constants.permissions.appointment;


class AppointmentResourceAggregator {
  constructor() {

    //Array<{appointmentId: int, permission:  'READ' || 'UPDATE', resourceId: int}>
    this.resources_ = [];
  }

  /*
    @param appointments: Array<{permission: 'UPDATE'||'READ', resource: {appointmentId: int, permission: 'UPDATE'||'READ', resourceId: int} }>
  */
  collect(appointments) {
    appointments.forEach(ap => {
      const mResource = this.resources_.find(r => r.appointmentId === ap.resource.appointmentId);
      if (!mResource) {
        //A
        //adding new appointment to the collection
        const permission = resolveWithSharedPermission(ap.permission, ap.resource.permission);
        const resource = ap.resource; resource.permission = permission;
        this.resources_.push(resource);
      } else {
        //B
        //updating the existing appointment permission
        let permission = resolveWithSharedPermission(ap.permission, ap.resource.permission);
        permission = resolveWithAppointmentPermission(permission, mResource.permission);
        mResource.permission = permission;
      }
    })
  }

  hasPermission(appointmentId, permission) {
    assert.ok(appointmentId); assert.ok([READ, UPDATE].indexOf(permission) >= 0);
    const r = this.resources_.find(r => r.appointmentId === appointmentId);
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
//@param pb, UPDATE || JOIN || READ, requested permission
function resolveWithSharedPermission(pa, pb) {
  return pa === READ? READ: pb;
}

function resolveWithAppointmentPermission(pa, pb) {
  //READ is lowest priority, whatever's on pb would be good
  if (pa === READ) return pb;
  
  return UPDATE;
}

module.exports = AppointmentResourceAggregator;