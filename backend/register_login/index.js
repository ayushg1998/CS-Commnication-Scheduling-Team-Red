const assert = require('assert');

module.exports = function(mysql, {userRepository, resourceRepository}) {
  assert.ok(userRepository);assert.ok(resourceRepository);
  
  const repository = require('./repository')(mysql, {userRepository, resourceRepository});
  const usecase = require('./usecase')(repository);
  const controller = require('./controller')(usecase);

  return {
    repository,
    usecase,
    controller
  };
}