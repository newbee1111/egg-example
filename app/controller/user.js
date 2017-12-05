const { Controller } = require('egg');

class UserController extends Controller {
  * index() {
    yield this.ctx.render('login.ejs');
  }
  getMes() {
    const { tel } = this.ctx.request.body;
    console.log(tel);
    this.ctx.service.sms.sendMessage(tel);
  }
}

module.exports = UserController;
