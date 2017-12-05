const { Service } = require('egg');

class EventService extends Service {
  * getEvent(id) {
    const eventObj = yield this.ctx.model.Event.getEvent(id);
    return { event: eventObj };
  }
  * getEvents() {
    const rawResult = yield this.ctx.model.Event.getEvents();
    const events = [];
    rawResult.forEach(item => {
      events.push(item.dataValues);
    });
    return { events };
  }
  * insertEvent(eventObj) {
    const { event, status } = eventObj;
    const result = yield this.ctx.model.Event.addEvent({
      event,
      status,
    });
    if (result) {
      return { message: 'success' };
    }
    return { message: 'failure' };
  }

  * updateEvent(id) {
    // const event = yield this.ctx.model.Event.getEvent(id);
    const result = yield this.ctx.model.Event.updateEvent(id);
    if (result) {
      return { message: 'success' };
    }
    return { message: 'failure' };
  }
  * deleteEvent(id) {
    const result = yield this.ctx.model.Event.deleteEvent(id);
    if (result) {
      return { message: 'success' };
    }
    return { message: 'failure' };
  }
}

module.exports = EventService;
