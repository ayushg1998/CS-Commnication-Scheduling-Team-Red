const GroupResourceAggregator = require('./collector');
const assert = require('assert');

module.exports = function(repository, {resourceUsecase}) {
  async function getAllVisibleGroupsOfUser(userId) {
    assert.ok(userId);

    const collector = new GroupResourceAggregator();
    const fetcher = {fetch: repository.getGroupResourcesOfGroups};
  
    await resourceUsecase.getAccessibleResources(userId, collector, fetcher);
    return collector.getCollection();
  }

  return {
    getAllVisibleGroupsOfUser
  };
}