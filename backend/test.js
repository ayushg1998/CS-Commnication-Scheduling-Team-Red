const mysql = require('mysql');
const dbconfig = require('./config/database');

// //sql connection builder object, but not connected until
// //connection.connect (see builder pattern)
const connection = mysql.createConnection(dbconfig.connection);

connection.connect(async function(error) {
    if (error) throw error;

    console.log('connected to db');
    connection.query('USE calendar');

    const {repository: resourceRepository, usecase: resourceUsecase} = require('./resource')(connection);
    const {controller: userController, repository: userRepository} = require('./user')(connection);
    const { controller: registerController, usecase: registerUsecase } = require('./register_login')(connection, {userRepository, resourceRepository});
    const {repository: groupRepository, usecase: groupUsecase, controller: groupController} = require('./group')(connection, {resourceUsecase, resourceRepository, userRepository, registerUsecase });
    const {controller: appointmentController, usecase: appointmentUsecase, repository: appointmentRepository} = require('./appointment')(connection, {userRepository, resourceRepository, resourceUsecase});
    const {controller: colorController} = require('./color')(connection);
    const { controller: eventController, usecase: eventUsecase} = require('./event')(connection, {resourceRepository, resourceUsecase, userRepository});
    const {controller: calendarEventController, usecase: calendarEventUsecase} = require('./calendar_event')(connection, {userRepository, resourceUsecase, resourceRepository, eventUsecase, appointmentUsecase, appointmentRepository});

    const csv = `First name,Last name,ID number,Institution,Department,Email address,Last downloaded from this course
Hem,B K,30069048,,3XX,bkhb@warhawks.ulm.edu,1567713827
Brittany,Boren,30064831,,3XX,borenbl@warhawks.ulm.edu,1567713827
Amsterdam,Smith,30083005,,3XX,amsterdam@warhawks.ulm.edu,1567713827`;

    groupUsecase.addGroupMembersAsCsv({csv, groupId: 21, editorId: 2})
        .then(() => {
            console.log('done')
        })
});


