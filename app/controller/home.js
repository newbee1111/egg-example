const Controller = require('egg').Controller;

class HomeController extends Controller {
  async index() {
    const allEvents = await this.ctx.service.event.getEvents();
    await this.ctx.render('home.ejs', { allEvents });
  }
  async list() {
    const id = this.ctx.params.id;
    const { message } = await this.ctx.service.event.updateEvent(id);
    if (message === 'success') {
      this.ctx.redirect('/');
    }
  }
  async addEvent() {
    const { event, status } = this.ctx.request.body;
    const { message } = await this.ctx.service.event.insertEvent({
      event,
      status,
    });
    if (message === 'success') {
      this.ctx.response.body = { message };
    }
  }
  async deleteEvent() {
    const { id } = this.ctx.params;
    const { message } = await this.ctx.service.event.deleteEvent(id);
    if (message === 'success') {
      this.ctx.redirect('/');
    }
  }
}

module.exports = HomeController;
