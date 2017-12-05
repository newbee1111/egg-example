const Controller = require('egg').Controller;

class HomeController extends Controller {
  * index() {
    const allEvents = yield this.ctx.service.event.getEvents();
    yield this.ctx.render('home.ejs', { allEvents });
  }
  * list() {
    const id = this.ctx.params.id;
    const { message } = yield this.ctx.service.event.updateEvent(id);
    if (message === 'success') {
      this.ctx.redirect('/');
    }
  }
  * addEvent() {
    const { event, status } = this.ctx.request.body;
    const { message } = yield this.ctx.service.event.insertEvent({
      event,
      status,
    });
    if (message === 'success') {
      this.ctx.response.body = { message };
    }
  }
  * deleteEvent() {
    const { id } = this.ctx.params;
    const { message } = yield this.ctx.service.event.deleteEvent(id);
    if (message === 'success') {
      this.ctx.redirect('/');
    }
  }
}

module.exports = HomeController;
