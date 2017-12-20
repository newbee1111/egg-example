const { Service } = require('egg');

class UserService extends Service {
  * registryOrLogin(tel) {
    const UserModel = this.ctx.model.User;
    const user = yield UserModel.getOrCreateUser(tel);
    return user;
  }
  * mainIdentityCheck(user_id) {
    const BindIdentityModel = this.ctx.model.BindIdentity;
    return yield BindIdentityModel.mainIdentityCheck(user_id);
  }
}

module.exports = UserService;
