const assert = require('assert');

module.exports = function(mysql) {
  const repository = require('./repository')(mysql);
  const usecase = require('./usecase')(repository);  

  return {
    repository,
    usecase
  };
}