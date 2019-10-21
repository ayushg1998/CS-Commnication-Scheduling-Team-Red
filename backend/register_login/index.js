const assert = require('assert');

module.exports = function(mysql, {userRepository, resourceRepository, groupRepository}) {
  assert.ok(userRepository);assert.ok(resourceRepository);assert.ok(groupRepository);
  
  const repository = require('./repository')(mysql, {userRepository, resourceRepository, groupRepository});
  const usecase = require('./usecase')(repository);
  const controller = require('./controller')(usecase);

  return {
    repository,
    usecase,
    controller
  };
}