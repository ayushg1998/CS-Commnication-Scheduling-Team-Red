module.exports = function(mysql) {
  const repository = require('./repository')(mysql);

  return { repository };
}