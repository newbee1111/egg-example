const { Service } = require('egg');

class EventService extends Service {
  async getEvent(id) {
    const eventObj = await this.app.mysql.get('test', { id });
    return { event: eventObj };
  }
  async getEvents() {
    const events = await this.app.mysql.select('test');
    return { events };
  }
  async insertEvent(eventObj) {
    const { event, status } = eventObj;
    const result = await this.app.mysql.insert('test', { event, status });

    if (result.affectedRows) {
      return { message: 'success' };
    }
    return { message: 'failure' };
  }
  async updateEvent(id) {
    const { event } = await this.getEvent(id);
    const { status } = event;
    const result = await this.app.mysql.update('test', { id, status: !status });
    if (result.affectedRows) {
      return { message: 'success' };
    }
    return { message: 'failure' };
  }
  async deleteEvent(id) {
    const result = await this.app.mysql.delete('test', { id });
    if (result.affectedRows) {
      return { message: 'success' };
    }
    return { message: 'failure' };
  }
}

module.exports = EventService;
