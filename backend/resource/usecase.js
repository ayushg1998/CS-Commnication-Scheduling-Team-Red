const { READ, JOIN, UPDATE, UPDATE_JOIN } = require('../constants').permissions.event;

module.exports = function(repository) {
  /*
    @param userId int
    @param collector {
      collect: (pairs: Array<{resource, permission}>) => void
    }
    @param fetcher {
      fetch: (groupIds: Array<int>) => Array<{groupId, resource[]}>
    }
  */
  async function getAccessibleResources(userId, collector, fetcher) {
  const visitedUsers = [{userId, permission: 'UPDATE'}];
  const visitedGroups = [];


  //userId > groups > resources(except user resource) > sharedUser
  await (async function recur(currentUsers) {
    if (!currentUsers.length) return;

    const currentUserIds = currentUsers.map(u => u.userId);

    //[{userId, groups: Array<{id: int}>}]
    const groupsOfUsers = await repository.getGroupsOfUsers(currentUserIds);
    
    //[{groupId, permission}]
    let currentGroups = groupsOfUsers.reduce((acc, k)=> {
      let {userId, groups} = k;

      //`visitedUsers` are already updated with `currentUsers`, so this can be done
      const permission = visitedUsers.find(u => u.userId === userId).permission;

      groups.forEach(g => { 
        const accG = acc.find(g_ => g_.groupId === g.id);
        if (!accG) { acc.push({groupId: g.id, permission }); return;}

        if (checkPermission(accG.permission, permission) < 0) accG.permission = permission;
      });

      return acc;
    }, []);

    //elems in currentGroups either not in visited group, or has greater permission than
    //the group present in visitedGroup
    currentGroups = currentGroups.filter(each => {
      const vg = visitedGroups.find(g => each.groupId === g.groupId);
      return !vg || checkPermission(vg.permission, each.permission) < 0;
    });

    //elems in currentGroups are added in visitedGroup
    //if the elem is already present, then the permission is updated.
    currentGroups.forEach(each => {
      const vg = visitedGroups.find(g => each.groupId === g.groupId);
      if (!vg) { visitedGroups.push(each); return; }
      vg.permission = each.permission;
    });

    const currentGroupIds = currentGroups.map(g => g.groupId);
    
    //[{groupId, resources: Array<{[whateverId]: int, permission: string, resourceId: int}>}]
    const resourcesOfGroups = await fetcher.fetch(currentGroupIds);

    //this permission in resourcePermission par is more of a max permission, the resource may have
    //[{resource, permission}]
    const resourcePermissionPairs = resourcesOfGroups.reduce((acc, each) => {
      const {resources, groupId} = each;
      const permission = currentGroups.find(g => g.groupId == groupId).permission;

      resources.forEach(resource => {
        acc.push({permission, resource});
      });
      return acc;
    }, []);

    collector.collect(resourcePermissionPairs);

    //[{groupId, resources: []}]
    const userResourcesOfGroups = await repository.getUserResourcesOfGroups(currentGroupIds);
    
    //[{userId, permission}]
    let nextUsers = userResourcesOfGroups.reduce((acc, each) => {
      const {groupId, resources} = each;
      const groupMaxPermission = currentGroups.find(g => g.groupId === groupId).permission;

      //here chosing lesser of group's max permission and group's resource permission
      const userIdPermissionPairs = resources.map(r => ({
        userId: r.userId, 
        permission: checkPermission(groupMaxPermission, r.permission) < 0? groupMaxPermission: r.permission
      }));

      userIdPermissionPairs.forEach(each => {
        let pair = acc.find(each_ => each_.userId === each.userId);
        if (!pair) { acc.push(each); return }
        if (checkPermission(pair.permission, each.permission) < 0) pair.permission = each.permission;
      });

      return acc;
    }, []);

    //BEGIN: updating visitedUsers
    //if not in visitedUsers, push to it.
    //if in visitedUsers, but the nextUser has better permission, then update visited user
    //if in visitedUsers, and nextUser has lower permission, then discard it
    nextUsers = nextUsers.filter(u => {
      let visitedUserIndex = -1;
      let visitedUser = visitedUsers.find((vu, index) => {
        if (vu.userId === u.userId) { visitedUserIndex = index; return true;}
        return false;
      });

      if (!visitedUser){ visitedUsers.push(u); return true; }
      if (checkPermission(visitedUser.permission, u.permission) === -1) {
        visitedUser[visitedUserIndex].permission = u.permission;
        return true;
      }
      return false;
    });
    //END: updating visitedUsers

    return recur(nextUsers);
  })([{userId, permission: 'UPDATE'}]);
  }

  return {
    getAccessibleResources
  };
}

//return -1 if a is lesser than b
//return  0 if a  equals        b
//return  1 if a  greater than  b
function checkPermission(a, b) {
  if (a === UPDATE) return b === UPDATE? 0: 1;
  if (a === READ) return b === READ? 0: -1;
}