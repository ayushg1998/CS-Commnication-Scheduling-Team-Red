const assert = require('assert');

module.exports = function(mysql, {userRepository, resourceRepository, groupRepository}) {

  return {
    createUser: userRepository.createUser,
    findUserByCWID: userRepository.findUserByCWID,
    findUserByUsername: userRepository.findUserByUsername,
    addUserResource: resourceRepository.addUserResource,
    addResourcePermissionToUserGroup: resourceRepository.addResourcePermissionToUserGroup,
    createGroup: groupRepository.createGroup,
    addGroupMember: groupRepository.addGroupMember,
  };
}