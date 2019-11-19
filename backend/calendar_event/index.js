const assert = require('assert');

module.exports = function(mysql, {userRepository, appointmentRepository, resourceUsecase, resourceRepository, eventUsecase, appointmentUsecase}) {
  assert.ok(userRepository); assert.ok(eventUsecase); assert.ok(appointmentUsecase);
  
  const repository = require('./repository')(mysql, {userRepository, resourceRepository, appointmentRepository});
  const usecase = require('./usecase')(repository, {resourceUsecase, eventUsecase, appointmentUsecase});
  const controller = require('./controller')(usecase);

  return {
    repository,
    usecase,
    controller
  };
}