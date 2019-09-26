var emailValidator = require('email-validator');

function checkCWID(cwid) {
    return !!(cwid && (cwid + '').length == 8);
}

function checkEmail(email) {
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
    checkEmail,
    checkUsername,
    checkPassword,
    checkFname,
    checkLname
};