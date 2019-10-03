module.exports = function(mysql) {
  const repository = require('./repository')(mysql);
  const usecase = require('./usecase')(repository);
  const controller = require('./controller')(usecase);

  return {
    repository,
    usecase,
    controller
  };
}