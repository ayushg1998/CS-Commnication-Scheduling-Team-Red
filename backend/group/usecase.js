const GroupResourceAggregator = require('./collector');
const assert = require('assert');
const {UPDATE, READ} = require('../constants').permissions.group;

module.exports = function(repository, {resourceUsecase, registerUsecase}) {
  //@return Array<{groupId: int, permission: 'READ' || 'UPDATE', resourceId: int}>
  async function getAllVisibleGroupResourcesOfUser(userId) {
    assert.ok(userId);

    const collector = new GroupResourceAggregator();
    const fetcher = {fetch: repository.getGroupResourcesOfGroups};
  
    await resourceUsecase.getAccessibleResources(userId, collector, fetcher);
    return collector.getCollection();
  }

  //either creates direct permission for sharee, if not already exists
  //or updates direct permission for sharee
  //or makes no change if the same direct permission exist for sharee 
  //and errors if incompatible parameters
  async function shareGroupWithUser({sharerId, shareeId, groupId, permission}) {
    assert.ok(sharerId); assert.ok(shareeId); assert.ok(groupId);
    assert.ok(resourceUsecase.checkPermissionCompatible({groupId}, permission));

    //sharer should atlest have permission that he attempts to share
    const sharerHasPermission = await hasPermission(sharerId, groupId, permission);
    if (!sharerHasPermission)
      throw new Error('Sharer does not have sufficient permission, to grant the permission');
    
    const resource = await repository.getGroupResource(groupId);

    const group = await repository.getSoloGroupOfUser(shareeId);

    await resourceUsecase.addResourcePermissionToUserGroup({
      groupId: group.id,
      resourceId: resource.id, permission});
  }

  /*
    @param name: string,
    @param description: string,
    @param creatorId: number,
    @return Promise<number>,id of created group
  */
  async function createGroup({name, description, creatorId}) {
    assert.ok(creatorId);
    const insertedGroupId = await repository.createGroup({name, description, creatorId}); assert.ok(insertedGroupId);

    //register this new group as a resource
    const resourceId = await repository.addGroupResource(insertedGroupId);
    
    //give update permission to creator of group
    const creatorGroup = await repository.getSoloGroupOfUser(creatorId);
    await resourceUsecase.addResourcePermissionToUserGroup({groupId: creatorGroup.id, 
      resourceId, permission: UPDATE});

    return insertedGroupId;
  }

  /*
    Behaves correct even if there are duplicate cwids
    Behaves correct even if user is already member of the group
    @param cwids: Array<number>
    @param groupId: number
    @param editorId: number, userId of one who is doing this request
    @return Promise<void>
  */
  async function addGroupMembers({cwids, groupId, editorId}) {
    assert.ok(Array.isArray(cwids)); assert.ok(groupId);
    cwids = [...new Set(cwids)];

    const editorCanEdit = await hasPermission(editorId, groupId, UPDATE);
    if (!editorCanEdit) throw new Error('Editor does not have sufficient permission.');
    
    const members = await repository.getGroupMembers(groupId);
    const memberIds = new Set(members.map(m => m.id));
    const users = await repository.getUsersByCwids(cwids);
    const userIds = users.map(u => u.id).filter(uid => !memberIds.has(uid));
    
    await repository.addGroupMembers(userIds, groupId);
  }

  /*
    Behaves correct even if there are duplicate cwids
    Behaves correct even if user is not member of group
    @param cwids: Array<number>
    @param groupId: number
    @param editorId: number, userId of one who is doing this request
    @return Promise<void>
  */
  async function removeGroupMembers({cwids, groupId, editorId}) {
    assert.ok(Array.isArray(cwids)); assert.ok(groupId); assert.ok(editorId);
    cwids = [...new Set(cwids)];

    const editorCanEdit = await hasPermission(editorId, groupId, UPDATE);
    if (!editorCanEdit) throw new Error('Editor does not have sufficient permission.');

    const users = await repository.getUsersByCwids(cwids);
    const userIds = users.map(u => u.id);

    await repository.removeGroupMembers(userIds, groupId);
  }

  /*
    @param name: string
    @param description: string
    @param groupId: number
    @param editorId: number, userId of one who is doing this request
    @return Promise<void>
  */
  async function editGroup({name, description, groupId, editorId}) {
    assert.ok(editorId); assert.ok(groupId);

    const editorCanEdit = await hasPermission(editorId, groupId, UPDATE);
    if (!editorCanEdit) throw new Error('Editor does not have sufficient permission.');

    const group = await repository.getGroup(groupId); assert.ok(group);
    await repository.updateGroup({name, description, groupId});
  }

  async function hasPermission(userId, groupId, permission) {
    const collector = new GroupResourceAggregator();
    const fetcher = {fetch: repository.getGroupResourcesOfGroups};
  
    await resourceUsecase.getAccessibleResources(userId, collector, fetcher);

    return collector.hasPermission(groupId, permission);
  }

  /*
    @param groupId: number,
    @param userId: number, userId of one who is requesting
    @return Promise<{
      id: number,
      name: string,
      description: string,
      creatorId: number,
      permission: string,
      members: Array<{
        id: number,
        cwid: number,
        fname: string,
        lname: string,
        email: string
      }>
    }>

  */
  async function getGroup({groupId, userId}) {
    assert.ok(groupId); assert.ok(userId);
    const hasReadPermission = await hasPermission(userId, groupId, READ);
    if (!hasReadPermission) throw new Error('The group cannot be read by the user.');
    const hasUpdatePermission = await hasPermission(userId, groupId, UPDATE);

    const group = await repository.getGroup(groupId); assert.ok(group);
    const members = await repository.getGroupMembers(groupId);
    
    group.members = members;
    group.permission = hasUpdatePermission? UPDATE: READ;

    return group;
  }

  /*
    @return Promise<Array<{
      id: number,
      name: string,
      description: string,
      creatorId: number,
      permission: string
    }>>
  */
  async function getGroupsOfCreator({userId}) {
    assert.ok(userId);

    const groups = await repository.getGroupsOfCreator(userId);
    return groups.map(g => ({...g, permission: UPDATE}));
  }

  async function getAllVisibleGroupsOfUser({userId}) {
    assert.ok(userId);

    const groupResources = await getAllVisibleGroupResourcesOfUser(userId);
    const groupIds = groupResources.map(g => g.groupId);
    const groups = await repository.getGroups(groupIds);

    return groups.map(g => {
      const permission = groupResources.find(gr => gr.groupId === g.id).permission;
      g.permission = permission; return g;
    });
  }
  
  async function addGroupMembersAsCsv({csv, groupId, editorId}) {
    const editorCanEdit = await hasPermission(editorId, groupId, UPDATE);
    if (!editorCanEdit) throw new Error('Editor does not have sufficient permission.');

    //1. add students
    const { insertedCwids, existingCwids } = await registerUsecase.addStudentsAsCsv(csv);

    console.log({insertedCwids, existingCwids});
    //2. merge insertedCwids, existingCwids
    const cwids = [...insertedCwids, ...existingCwids ];

    //3. addGroupMembers
    return addGroupMembers({cwids, groupId, editorId});
  }

  //TODO: NOT TESTED!!
  async function removeGroupMembersAsCsv({csv, groupId, editorId}) {
    const editorCanEdit = await hasPermission(editorId, groupId, UPDATE);
    if (!editorCanEdit) throw new Error('Editor does not have sufficient permission.');

    const cwids = utils.parseUsersFromCsv(csv).map(each => each.cwid);
    return removeGroupMembers({cwids, groupId, editorId});
  }

  return {
    getAllVisibleGroupResourcesOfUser,
    shareGroupWithUser,
    createGroup,
    addGroupMembers,
    removeGroupMembers,
    editGroup,
    getGroup,
    getGroupsOfCreator,
    getAllVisibleGroupsOfUser,
    addGroupMembersAsCsv,
    removeGroupMembersAsCsv    
  };
}