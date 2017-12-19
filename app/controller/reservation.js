const { Controller } = require('egg');

class ReservationController extends Controller {
  * index() {
    const { cellphone } = this.ctx.user;
    yield this.ctx.render('reservation.ejs', { cellphone });
  }
}

module.exports = ReservationController;
