const emailValidator = require('email-validator');

function checkCWID(cwid) {
    return !!(cwid && (cwid + '').length == 8);
}

//TODO: change it
function checkFacultyEmail(email) {
    return !!(email && emailValidator.validate(email));
}

//TODO: change it
function checkStudentEmail(email) {
    return !!(email && emailValidator.validate(email));
}

function checkUsername(username) {
    return !!(username && typeof username === 'string' && username.length >= 5);
}

function checkPassword(pwd) {
    return !!(pwd && typeof pwd === 'string' && pwd.length >= 6 && /[0-9]/.test(pwd));
}

function checkFname(fname) {
    return !!(fname && typeof fname === 'string' && fname.length >= 3);
}

function checkLname(lname) {
    return !!(lname && typeof lname === 'string' && lname.length >= 3);
}

module.exports = {
    checkCWID,
    checkFacultyEmail,
    checkStudentEmail,
    checkUsername,
    checkPassword,
    checkFname,
    checkLname
};