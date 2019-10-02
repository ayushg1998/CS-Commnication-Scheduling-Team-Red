/*
    format is 'token_' + timestamp in millisecond + random number
*/
function createLoginToken() {
    return 'token_' + Date.now() + '_' + Math.round(Math.random() * 1000000);
}

module.exports = {
    createLoginToken
};