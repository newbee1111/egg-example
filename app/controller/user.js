const { Controller } = require('egg');
const { getExpireTime, getNowSeconds } = require('../utils/expireTime');
const jwt = require('jsonwebtoken');

class UserController extends Controller {
  * index() {
    yield this.ctx.render('login.ejs');
  }
  getMes() {
    const { tel } = this.ctx.request.body;
    let validateCode;
    if (process.env.__DEV__) {
      validateCode = '123456';
    } else {
      validateCode = this.ctx.service.sms.sendMessage(tel);
    }
    const expireTime = getExpireTime(60 * 5);
    this.ctx.response.body = { tel, validateCode, expireTime };
  }

  * login() {
    const { tel, expireTime } = this.ctx.request.body;
    const now = getNowSeconds();
    if (expireTime > now) {
      const user = yield this.ctx.service.user.registryOrLogin(tel);
      const token = jwt.sign({ tel }, 'secret', { expiresIn: '14d' });
      this.ctx.response.body = { success: true, token, user };
    } else {
      this.ctx.response.body = { success: false };
    }
  }

  * tokenVerify() {
    const { token } = this.ctx.request.body;
    const decoded = jwt.decode(token, 'secret');
    const { iat, exp, tel } = decoded;
    if (iat <= exp) {
      const user = yield this.ctx.service.user.registryOrLogin(tel);
      this.ctx.response.body = { success: true, user };
    } else {
      this.ctx.response.body = { success: false };
    }
  }
}

module.exports = UserController;
