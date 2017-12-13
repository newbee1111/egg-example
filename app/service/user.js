const { Service } = require('egg');

class UserService extends Service {
  * registryOrLogin(tel) {
    const UserModel = this.ctx.model.User;
    const user = yield UserModel.getOrCreateUser(tel);
    return user;
  }
}

module.exports = UserService;
