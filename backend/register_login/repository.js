const assert = require('assert');

module.exports = function(mysql, {userRepository}) {

  return {
      createUser: userRepository.createUser,
      findUserByCWID: userRepository.findUserByCWID,
      findUserByUsername: userRepository.findUserByUsername
    };
}