module.exports = function(mysql, {appointmentRepository, userRepository}) {
  const repository = require('./repository')(mysql, {appointmentRepository, userRepository});
  const usecase = require('./usecase')(repository);
  const controller = require('./controller')(usecase);

  return {
    repository,
    usecase,
    controller
  };
}