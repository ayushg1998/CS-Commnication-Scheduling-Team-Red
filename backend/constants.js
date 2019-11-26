module.exports = {
  USERTYPE_STUDENT: 'student',
  USERTYPE_FACULTY: 'faculty',
  permissions: {
    event: {
      UPDATE: 'UPDATE',
      JOIN: 'JOIN',
      READ: 'READ',
      UPDATE_JOIN: 'UPDATE+JOIN'
    },
    appointmentEvent: {
      UPDATE: 'UPDATE',
      JOIN: 'JOIN',
      READ: 'READ',
      UPDATE_JOIN: 'UPDATE+JOIN'
    },
    appointment: {
      UPDATE: 'UPDATE',
      READ: 'READ'      
    },
    user: {
      UPDATE: 'UPDATE',
      READ: 'READ'
    },
    group: {
      UPDATE: 'UPDATE',
      READ: 'READ'
    }
  },
  resourceTypes: {
    USER: 'USER',
    EVENT: 'EVENT',
    APPOINTMENT_EVENT: 'APPOINTMENT_EVENT',
    APPOINTMENT: 'APPOINTMENT',
    GROUP: 'GROUP'
  },
  ADMIN_EMAIL: 'lsmith@ulm.edu'
}