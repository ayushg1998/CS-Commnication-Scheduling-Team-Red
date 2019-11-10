const mysql = require('mysql');
const dbconfig = require('./config/database');

//sql connection builder object, but not connected until
//connection.connect (see builder pattern)
const connection = mysql.createConnection(dbconfig.connection);

connection.connect(async function(error) {
    if (error) throw error;

    console.log('connected to db');
    connection.query('USE calendar');

    const {repository: resourceRepository, usecase: resourceUsecase} = require('./resource')(connection);
    const {controller: userController, repository: userRepository} = require('./user')(connection);
    const {repository: groupRepository, usecase: groupUsecase, controller: groupController} = require('./group')(connection, {resourceUsecase, resourceRepository, userRepository});
    // const {controller: appointmentController, usecase: appointmentUsecase} = require('./appointment')(connection, {userRepository, resourceRepository, resourceUsecase});
    // const {controller: colorController} = require('./color')(connection);
    // const { controller: eventController, usecase: eventUsecase} = require('./event')(connection, {resourceRepository, resourceUsecase, userRepository});
    // const {controller: calendarEventController, usecase: calendarEventUsecase} = require('./calendar_event')(connection, {userRepository, resourceUsecase, resourceRepository, eventUsecase, appointmentUsecase});
    // const { controller: loginController } = require('./register_login')(connection, {userRepository, resourceRepository, groupRepository});

    console.log(result);
});