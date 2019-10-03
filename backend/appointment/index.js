module.exports = function(mysql, {userRepository}) {
  const repository = require('./repository')(mysql, {userRepository});
  const usecase = require('./usecase')(repository);
  const controller = require('./controller')(usecase);

  return {
    repository,
    usecase,
    controller
  };
}