module.exports = {
    createRandomPassword: function () {
        return 'password_' + Math.round(Math.random() * 1000000);
    }
}