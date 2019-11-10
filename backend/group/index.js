const assert = require('assert');

module.exports = function(mysql, {resourceUsecase, resourceRepository, userRepository}) {
  assert.ok(resourceUsecase); assert.ok(userRepository); assert.ok(resourceRepository);

  const repository = require('./repository')(mysql, {resourceRepository, userRepository});
  const usecase = require('./usecase')(repository, {resourceUsecase});
  const controller = require('./controller')(usecase);
  
  return {
    repository,
    usecase,
    controller
  };
}