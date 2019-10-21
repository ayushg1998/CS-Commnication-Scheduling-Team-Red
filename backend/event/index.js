const assert = require('assert');

module.exports = function(mysql, {resourceRepository, resourceUsecase}) {
  assert.ok(resourceRepository); assert.ok(resourceUsecase);

  const repository = require('./repository')(mysql, {resourceRepository});
  const usecase = require('./usecase')(repository, {resourceUsecase});
  const controller = require('./controller')(usecase);

  return {
    repository,
    usecase,
    controller
  };
}