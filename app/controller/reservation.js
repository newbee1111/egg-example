const { Controller } = require('egg');

class ReservationController extends Controller {
  * index() {
    const { cellphone, id } = this.ctx.user;
    yield this.ctx.render('reservation.ejs', { cellphone, user_id: id });
  }
}

module.exports = ReservationController;
