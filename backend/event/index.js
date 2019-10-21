const assert = require('assert');

module.exports = function(mysql, {resourceRepository, resourceUsecase, userRepository}) {
  assert.ok(resourceRepository); assert.ok(resourceUsecase);

  const repository = require('./repository')(mysql, {resourceRepository, userRepository});
  const usecase = require('./usecase')(repository, {resourceUsecase});
  const controller = require('./controller')(usecase);

  return {
    repository,
    usecase,
    controller
  };
}