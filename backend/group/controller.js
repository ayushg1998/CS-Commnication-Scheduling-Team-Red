module.exports = function(usecase) {
  
  /*
    @body: {
      groupId: number,
      userId: number,
      permission: string
    }
    @response: {
      success: true
    }
  */
  async function shareGroupWithUser(req, res, next) {
    try {
      const sharerId = parseInt(req.user.id);
      const groupId = parseInt(req.body.groupId);
      const shareeId = parseInt(req.body.userId);
      const permission = req.body.permission;

      await usecase.shareGroupWithUser({sharerId, shareeId, groupId, permission});

      res.send({success: true});
    } catch(err) {
      res.send({success: false, message: error.message});
    }
  }

  /*
    @response: {
      success: true,
      group: {
        id: number,
        name: string,
        description: string,
        creatorId: number,
        permission: string
        members: Array<{
          id: number,
          cwid: number,
          fname: string,
          lname: string,
          email: string
        }>
        }
    }
  */
  async function getGroup(req, res, next) {
    try {
      const userId = parseInt(req.user.id);
      const groupId = parseInt(req.params.id);
  
      console.log(userId); console.log(groupId);
      const group = await usecase.getGroup({userId, groupId});
      res.send({success: true, group});
    } catch(error) {
      res.send({success: false, message: error.message});
    }
  }

  /*
    @response: {
      success: true,
      filters: Array<string>,
      groups: Array<{
        id: number,
        name: string,
        description: string,
        creatorId: number,
        permission: string
      }>
    }
  */
  async function getMyGroups(req, res, next) {
    try {
      const queryFilters = req.query.filters || [];
      const allVisibleFlag  = queryFilters.indexOf('all_visible') >= 0;

      const userId = parseInt(req.user.id);

      const groups = await (allVisibleFlag? 
        usecase.getAllVisibleGroupsOfUser({userId})
        : usecase.getGroupsOfCreator({userId}));

      const resFilters = [];
      if (allVisibleFlag) resFilters.push('all_visible');

      res.send({success: true, filters: resFilters,  groups});
    } catch(error) {
      res.send({success: false, error: error.message});
    }
  }

  /*
    @body: {
      name: string,
      description: string
    },
    @response: {
      success: true,
      groupId: number
    }
  */
  async function addGroup(req, res, next) {
    try {
      const creatorId = parseInt(req.user.id);
      const name = req.body.name;
      const description = req.body.description;
  
      const groupId = await usecase.createGroup({name, description, creatorId});
  
      res.send({ success: true, groupId });
    } catch(error) {
      res.send({success: false, error: error.message});
    }
  }

  /*
    @body: {
      name: string,
      description: string
    },
    @response: {
      success: true
    }
  */
  async function editGroup(req, res, next) {
    try {
      const groupId = parseInt(req.params.id);
      const editorId = parseInt(req.user.id);
      const name = req.body.name;
      const description = req.body.description;

      await usecase.editGroup({name, description, groupId, editorId});
      res.send({success: true});
    } catch(error) {
      res.send({success: false, error: error.message});
    }
  }

  /*
    @body: {
      cwids: Array<number>
    }
    @response: {
      success: true
    }
  */  
  async function addGroupMembers(req, res, next) {
    try {
      const groupId = parseInt(req.params.id);
      const editorId = parseInt(req.user.id);
      const cwids = req.body.cwids;

      console.log(groupId);
      console.log(cwids);

      await usecase.addGroupMembers({cwids, groupId, editorId});
      res.send({success: true});
    } catch(error) {
      res.send({success: false, error: error.message});
    }
  }
  
  /*
    @body: {
      cwids: Array<number>
    }
    @response: {
      success: true
    }
  */
  async function removeGroupMembers(req, res, next) {
    try {
      const groupId = parseInt(req.params.id);
      const editorId = parseInt(req.user.id);
      const cwids = req.body.cwids;

      await usecase.removeGroupMembers({cwids, groupId, editorId});
      res.send({success: true});
    } catch(error) {
      res.send({success: false, error: error.message});
    }
  }

    /*
    @body: {
      csv: string
    }
    @response: {
      success: true
    }
  */
  async function addGroupMembersAsCsv(req, res, next) {
    try {
      const groupId = parseInt(req.params.id);
      const editorId = parseInt(req.user.id);
      const csv = req.body.csv;

      await usecase.addGroupMembersAsCsv({csv, groupId, editorId});
      res.send({success: true});
    } catch(error) {
      res.send({success: false, error: error.message});
    }
  }

  /*
    @body: {
      csv: string
    }
    @response: {
      success: true
    }
  */
  async function removeGroupMembersAsCsv(req, res, next) {
    try {
      const groupId = parseInt(req.params.id);
      const editorId = parseInt(req.user.id);
      const csv = req.body.csv;

      await usecase.removeGroupMembersAsCsv({csv, groupId, editorId});
      res.send({success: true});
    } catch(error) {
      res.send({success: false, error: error.message});
    }
  }

  return {
    shareGroupWithUser,
    getGroup,
    getMyGroups,
    addGroup,
    editGroup,
    addGroupMembers,
    removeGroupMembers,
    addGroupMembersAsCsv,
    removeGroupMembersAsCsv
  };
}