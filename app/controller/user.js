const { Controller } = require('egg');
const { getExpireTime } = require('../utils/expireTime');
// const jwt = require('jsonwebtoken');

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

  // * login() {
  //   const { tel, expireTime } = this.ctx.request.body;
  //   const now = getNowSeconds();
  //   if (expireTime > now) {
  //     const user = yield this.ctx.service.user.registryOrLogin(tel);
  //     const token = jwt.sign({ tel }, 'secret', { expiresIn: '1d' });
  //     const { id } = user;
  //     yield this.app.sessionStore.set(id, user);
  //     const bind = yield this.ctx.service.user.mainIdentityCheck(id);
  //     this.ctx.response.body = { success: true, token, user, bind: !bind };
  //   } else {
  //     this.ctx.response.body = { success: false };
  //   }
  // }

  // * tokenVerify() {
  //   const { token } = this.ctx.request.body;
  //   const decoded = jwt.decode(token, 'secret');
  //   const { exp, tel } = decoded;
  //   const now = getNowSeconds();
  //   if (now <= exp) {
  //     const user = yield this.ctx.service.user.registryOrLogin(tel);
  //     const { id } = user;
  //     yield this.app.sessionStore.set(id, user);
  //     const bind = yield this.ctx.service.user.mainIdentityCheck(id);
  //     this.ctx.response.body = { success: true, user, bind: !bind };
  //   } else {
  //     this.ctx.response.body = { success: false };
  //   }
  // }

  // * cleanSession() {
  //   const { id } = this.ctx.user;
  //   yield this.app.sessionStore.destroy(id);
  //   // 检测session是否已经删除
  //   const testRes = yield this.app.sessionStore.get(id);
  //   console.log(testRes);
  // }

  * getWXinfo() {
    const appId = 'Your appId';
    this.ctx.response.body = { appId };
  }

  * wxLogin() {
    const { code } = this.ctx.request.body;
    const result = yield this.ctx.service.user.wxLogin(code);

    this.ctx.response.body = result;
  }
}

module.exports = UserController;
