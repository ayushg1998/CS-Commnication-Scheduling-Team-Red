import * as api from '../shared/api';

class Repository {
  
  getAllVisibleGroups() {
    return api.getAllVisibleGroups();
  }

  getAllUsers() {
    return api.getAllUsers()
      .then(users => {
        return users.map(u => ({
          id: u.id,
          cwid: u.cwid,
          fname: u.fname,
          lname: u.lname,
          email: u.email
        }));
      })
  }

  getAllMembers(groupId) {
    return api.getSpecificGroup(groupId)
      .then(group => group.members);
  }

  addGroupMembers(groupId, cwids) {
    return api.addGroupMembers(groupId, cwids);
  }

  removeGroupMembers(groupId, cwids) {
    return api.removeGroupMembers(groupId, cwids);
  }
}