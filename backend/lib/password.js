module.exports = {
    /*@return e.g. hello_123*/
    createPasswordFromUsername: function (username) {
        return username + '_' +  Math.round(Math.random() * 1000);
    }
}