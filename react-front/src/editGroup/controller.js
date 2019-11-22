import * as assert from 'assert';

export default class Controller {
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

  onSelectedAddGroupMembersChanged(memberIds) {
    this.assertFunctioning();
    const v = this.view; const gsm = this.groupStateManager;
    gsm.setAddGroupMembers(memberIds);
    v.setSelectedGroupMembersToAdd(mapMembersToView(gsm.getMembersToAdd()));
  }

  onSelectedRemoveGroupMembersChanged(memberIds) {
    this.assertFunctioning();
    const v = this.view; const gsm = this.groupStateManager;
    gsm.setRemoveGroupMembers(memberIds);
    v.setSelectedGroupMembersToRemove(mapMembersToView(gsm.getMembersToRemove()));
  }

  async onAddGroupMemberSubmit() {
    this.assertFunctioning();
    const v = this.view, gsm = this.groupStateManager;
    if (!gsm.hasActiveGroup()) return;

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
        v.showAlert(err.message);
      })
      .finally(() => {
        this.busy = false; v.enableAllInteraction();
      });
  }

  async onRemoveGroupMemberSubmit() {
    this.assertFunctioning();
    const v = this.view, gsm = this.groupStateManager;
    if (!gsm.hasActiveGroup()) return;

    const members = gsm.getMembersToRemove(), groupId = gsm.getActiveGroup().id;
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
        v.showAlert(err.message);
      })
      .finally(() => {
        this.busy = false; v.enableAllInteraction();
      });
  }

  async refreshMembers() {
    this.assertFunctioning();
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
    this.assertFunctioning();
    const v = this.view, gsm = this.groupStateManager;

    gsm.setActiveGroup(groupId);
    if (!gsm.hasActiveGroup()) {
      v.setTotalGroupMembersToAdd([]);
      v.setTotalGroupMembersToRemove([]);
      v.setSelectedGroupMembersToAdd([]);
      v.setSelectedGroupMembersToRemove([]);
      v.setSelectedGroup(null);
      return;
    }

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

    v.setSelectedGroup(groupToView(gsm.getActiveGroup()));
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
            this.view.setSelectedGroup(null);
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

class GroupStateManager {
  constructor(groups, memberPool) {
    this.groups = groups;
    this.memberPool = memberPool;
    this.activeGroup = null;
  }

  setActiveGroup(groupId) {
    const activeGroup = this.groups.find(g => g.id === groupId);
    if (!activeGroup) { this.activeGroup = null; return; }

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

  setAddGroupMembers(memberIds) {
    assert.ok(memberIds);
    const activeGroup = this.activeGroup; assert.ok(activeGroup);
    const addables = activeGroup.addableMembers.filter(m => memberIds.indexOf(m.id) >= 0);
    activeGroup.membersToAdd = addables;    
  }

  setRemoveGroupMembers(memberIds) {
    assert.ok(memberIds);
    const activeGroup = this.activeGroup; assert.ok(activeGroup);
    const removables = activeGroup.removableMembers.filter(m => memberIds.indexOf(m.id) >= 0);    
    activeGroup.membersToRemove = removables;
  }

  getAddableMembers() {
    const activeGroup = this.activeGroup; assert.ok(activeGroup);
    return [...activeGroup.addableMembers];
  }

  getRemovableMembers() {
    const activeGroup = this.activeGroup; assert.ok(activeGroup)
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

  hasActiveGroup() {
    return !!this.activeGroup;
  }

  hasMembersBeenSet() {
    const activeGroup = this.activeGroup;
    return activeGroup? !!activeGroup.isMembersSet: false;
  }
}

function groupToView(g) {
  return {name: g.name, id: g.id};
}

function mapGroupsToView(groups) {
  return groups.map(groupToView);
}

function mapMembersToView(members) {
  return members.map(u => ({id: u.id, name: `${u.fname} ${u.lname}`}));
}