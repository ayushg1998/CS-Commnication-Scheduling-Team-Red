const assert = require('assert');

module.exports = function(mysql, {userRepository, resourceRepository, resourceUsecase}) {
  assert.ok(userRepository); assert.ok(resourceRepository);

  const repository = require('./repository')(mysql, {userRepository, resourceRepository});
  const usecase = require('./usecase')(repository, {resourceUsecase});
  const controller = require('./controller')(usecase);

  return {
    repository,
    usecase,
    controller
  };
}