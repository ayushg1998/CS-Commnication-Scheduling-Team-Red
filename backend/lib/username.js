module.exports = {
  parseUsernameFromEmail: function(email) {
    return email.split('@')[0];
  }
}