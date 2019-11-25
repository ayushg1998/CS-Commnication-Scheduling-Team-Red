const constants = require('../constants');
const { READ, JOIN, UPDATE, UPDATE_JOIN } = constants.permissions.event;

module.exports = function(usecase) {

  /*
    @body {
      name: string,
      description: null | string,
      image: null,
      start: Date,
      end: Date,
      color: string,
      creatorId: int,
      groupId: int
    }
  */
  async function addEvent(req, res, next) {
    try {
      const userId = req.user.id;

      const event = {
        name: req.body.name,
        description: req.body.description,
        image: null,
        start: req.body.start,
        end: req.body.end,
        color: req.body.color,
        creatorId: userId,
        groupId: req.body.groupId
      };

      await usecase.addEvent(event);

      res.send({success: true});
    } 
    catch(err) {
      res.send({success: false, message: err.message});
    }   
  }

  async function editEvent(req, res, next) {
    try {
      const eventId = req.params.id; assert.ok(eventId);
      const userId = req.user.id;

      const event = {
        name: req.body.name,
        description: req.body.description,
        image: null,
        start: req.body.start,
        end: req.body.end,
        color: req.body.color,
      };

      await usecase.updateEvent({eventId, userId, event});

      res.send({success: true});

    }
    catch(err) {
      res.send({success: false, message: err.message});
    }
  }

  async function getEvents(req, res, next) {
    try {
      const userId = req.user.id;

      const events = await usecase.getAllVisibleEventsOfUser({userId});

      res.send({success: true, events});
    }
    catch(err) {
      res.send({success: false, message: err.message});
    }
  }
  
  async function shareEvent(req, res, next) {
    try {
      const eventId = req.body.eventId;
      const permission = req.body.permission;
      const sharerId = req.user.id;
      const shareeId = req.body.userId;

      await usecase.shareEventWithUser({
        sharerId, shareeId, permission, eventId});

      res.send({success: true});
    }
    catch(err) {
      res.send({success: false, message: err.message});
    }
  }

  return {
    addEvent,
    editEvent,
    getEvents,
    shareEvent
  };
}