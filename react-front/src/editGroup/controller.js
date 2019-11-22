import * as assert from 'assert';

class GroupStateManager {
  constructor(groups, memberPool) {
    this.groups = groups;
    this.memberPool = memberPool;
    this.activeGroup = null;
  }

  setActiveGroup(groupId) {
    const activeGroup = this.groups.find(g => g.id === groupId); assert.ok(activeGroup);

    if (!activeGroup.activeBefore) {
      activeGroup.members = [];
      activeGroup.membersToAdd = [];
      activeGroup.membersToRemove = [];
      activeGroup.addableMembers = [];
      activeGroup.removableMembers = [];
      activeGroup.activeBefore = true;
    }
    
    this.activeGroup = activeGroup;
  }

  setGroupMembers(members) {
    assert.ok(members);
    const activeGroup = this.activeGroup; assert.ok(activeGroup);
    activeGroup.members = members;
    activeGroup.membersToAdd = [];
    activeGroup.membersToRemove = [];

    activeGroup.removableMembers = [...members];
    activeGroup.addableMembers = this.memberPool.filter(m => !members.find(m_ => m_.id === m.id));
    activeGroup.isMembersSet = true;
  }

  addGroupMember(memberId) {
    assert.ok(memberId);
    const activeGroup = this.activeGroup; assert.ok(activeGroup);
    const isAddable = !!activeGroup.addableMembers.find(m => m.id === memberId);
    const memberToAddAlready = !!activeGroup.membersToAdd.find(m => m.id === memberId);

    if (isAddable && !memberToAddAlready){
      const member = memberPool.find(m => m.id === memberId); assert.ok(member);
      activeGroup.membersToAdd.push(member);
    }
  }

  unaddGroupMember(memberId) {
    assert.ok(memberId);
    const activeGroup = this.activeGroup; assert.ok(activeGroup);
    activeGroup.membersToAdd = activeGroup.membersToAdd.filter(m => m.id !== memberId);
  }

  removeGroupMember(memberId) {
    assert.ok(memberId);
    const activeGroup = this.activeGroup; assert.ok(activeGroup);
    const isRemovable = !!activeGroup.removableMembers.find(m => m.id === memberId);
    const memberToRemoveAlready = !!activeGroup.membersToRemove.find(m => m.id === memberId);
    
    if (isRemovable && !memberToRemoveAlready){
      const member = memberPool.find(m => m.id === memberId); assert.ok(member);
      activeGroup.membersToRemove.push(member);
    }
  }

  getAddableMembers() {
    const activeGroup = this.activeGroup; assert.ok(activeGroup);
    return [...activeGroup.addableMembers];
  }

  getRemoveableMembers() {
    const activeGroup = this.activeGroup; assert.ok(activeGroup);
    return [...activeGroup.removableMembers];
  }

  getMembersToAdd() {
    const activeGroup = this.activeGroup; assert.ok(activeGroup);
    return [...activeGroup.membersToAdd];
  }

  getMembersToRemove() {
    const activeGroup = this.activeGroup; assert.ok(activeGroup);
    return [...activeGroup.membersToRemove];
  }

  getGroups() {
    return [...this.groups];
  }

  getActiveGroup() {
    return this.activeGroup;
  }

  hasMembersBeenSet() {
    const activeGroup = this.activeGroup; assert.ok(activeGroup);
    return !!activeGroup.isMembersSet;
  }
}

class Controller {
  constructor({repository}) {
    assert.ok(repository); 
    this.repo = repository;
    this.groupStateManager = null;
    this.view = null;

    this.initialized = false;
    this.destroyed = false;
    this.busy = false;
  }

  setView(view) {
    this.view = view;
  }

  onAddGroupMemberSelected(memberId) {
    assertFunctioning();
    const v = this.view, gsm = this.groupStateManager;
    gsm.addGroupMember(memberId);
    v.setSelectedGroupMembersToAdd(
      mapMembersToView(gsm.getMembersToAdd()));
  }

  onRemoveGroupMemberSelected(memberId) {
    assertFunctioning();
    const v = this.view, gsm = this.groupStateManager;
    gsm.removeGroupMember(memberId);
    v.setSelectedGroupMembersToAdd(
      mapMembersToView(gsm.getMembersToRemove()));
  }

  async onAddGroupMemberSubmit() {
    assertFunctioning();
    const v = this.view, gsm = this.groupStateManager;
    const members = gsm.getMembersToAdd(), groupId = gsm.getActiveGroup().id;
    const cwids = members.map(m => m.cwid);

    if (!cwids.length) return;

    this.busy = true; v.disableAllInteraction();
    await this.repo.addGroupMembers(groupId, cwids)
      .then(() => {
        this.busy = false;
        v.enableAllInteraction();
        this.refreshMembers();
      })
      .catch(err => {
        showAlert(err.message);
      })
      .finally(() => {
        this.busy = false; v.enableAllInteraction();
      });
  }

  async onRemoveGroupMemberSubmit() {
    assertFunctioning();
    const v = this.view, gsm = this.groupStateManager;
    const members = gsm.getMembersToRemove(), groupId = gsm.getActiveGroup().groupId;
    const cwids = members.map(m => m.cwid);

    if (!cwids.length) return;

    this.busy = true; v.disableAllInteraction();
    await this.repo.removeGroupMembers(groupId, cwids)
      .then(() => {
        this.busy = false;
        v.enableAllInteraction();
        this.refreshMembers();
      })
      .catch(err => {
        showAlert(err.message);
      })
      .finally(() => {
        this.busy = false; v.enableAllInteraction();
      });
  }

  async refreshMembers() {
    assertFunctioning();
    const v = this.view, gsm = this.groupStateManager;
    this.busy = true; v.disableAllInteraction();

    const groupId = gsm.getActiveGroup().id;
     
    await this.repo.getAllMembers(groupId)
      .then(members => {
        gsm.setGroupMembers(members);
      })
      .catch(err => { v.showAlert(err.message); })
      .finally(() => {
        this.busy = false;
        v.enableAllInteraction();
      });

    v.setTotalGroupMembersToAdd(
      mapMembersToView(gsm.getAddableMembers()));
    v.setTotalGroupMembersToRemove(
      mapMembersToView(gsm.getRemovableMembers()));
    v.setSelectedGroupMembersToAdd(
      mapMembersToView(gsm.getMembersToAdd()));
    v.setSelectedGroupMembersToRemove(
      mapMembersToView(gsm.getMembersToRemove()));
  }

  async onGroupSelected(groupId) {
    assertFunctioning();
    const v = this.view, gsm = this.groupStateManager;

    gsm.setActiveGroup(groupId);
    if (!gsm.hasMembersBeenSet()) {
      this.busy = true;
      v.disableAllInteraction();
      
      await this.repo.getAllMembers(groupId)
        .then(members => {
          gsm.setGroupMembers(members);
        })
        .catch(err => { v.showAlert(err.message); })
        .finally(() => {
          this.busy = false;
          v.enableAllInteraction();
        });
    }

    v.setTotalGroupMembersToAdd(
      mapMembersToView(gsm.getAddableMembers()));
    v.setTotalGroupMembersToRemove(
      mapMembersToView(gsm.getRemovableMembers()));
    v.setSelectedGroupMembersToAdd(
      mapMembersToView(gsm.getMembersToAdd()));
    v.setSelectedGroupMembersToRemove(
      mapMembersToView(gsm.getMembersToRemove()));
  }

  assertFunctioning() {
    assert.ok(this.initialized && !this.destroyed && !this.busy);
  }

  onViewStarted() {
    assert.ok(!this.destroyed);
    this.view.disableAllInteraction();

    this.repo.getAllVisibleGroups()
      .then(groups => {
        groups = groups.filter(g => g.permission === 'UPDATE');        
        
        return this.repo.getAllUsers()
          .then(users => {
            this.groupStateManager = new GroupStateManager(groups, users);
            this.initialized = true;

            let groups_ = this.groupStateManager.getGroups();
            groups_ = mapGroupsToView(groups_);

            this.view.setGroups(groups_);            
            this.view.enableAllInteraction();
          });
      })
      .catch(error => {
        this.view.showAlert(error.message);
      })
  }

  onViewStopped() {

  }
}

function mapGroupsToView(groups) {
  return groups.map(g => ({name: g.name, id: g.id}));
}

function mapMembersToView(members) {
  return members.map(u => ({id: u.id, name: `${u.fname} ${u.lname}`}));
}