const assert = require('assert');

module.exports = function(mysql, {resourceUsecase}) {
  assert.ok(resourceUsecase);

  const repository = require('./repository')(mysql);
  const usecase = require('./usecase')(repository, {resourceUsecase});
  
  return {
    repository,
    usecase
  };
}