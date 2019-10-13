module.exports = function(repository) {
  async function getColors() {
    return repository.getColors();
  }
  return { getColors };
};