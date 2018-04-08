const { Service } = require('egg');

class UserService extends Service {
  * registryOrLogin(openid) {
    const UserModel = this.ctx.model.User;
    const user = yield UserModel.getOrCreateUser(openid);
    return user;
  }
  * mainIdentityCheck(user_id) {
    const BindIdentityModel = this.ctx.model.BindIdentity;
    return yield BindIdentityModel.mainIdentityCheck(user_id, true);
  }
  * wxLogin(code) {
    const appId = 'Your appId';
    const AppSecret = 'Your appSecret';
    let tokenObj = yield this.ctx.curl(
      `https://api.weixin.qq.com/sns/oauth2/access_token?appid=${appId}&secret=${AppSecret}&code=${code}&grant_type=authorization_code`
    );
    tokenObj = tokenObj.data.toString();
    tokenObj = JSON.parse(tokenObj);
    const openid = tokenObj.openid;
    if (!openid) return { success: false };
    const result = yield this.registryOrLogin(openid);
    if (result) {
      const { id } = result;
      yield this.app.sessionStore.set(id, result);
      const bind = yield this.mainIdentityCheck(id);
      return { success: true, user: result, tokenObj, bind: !bind };
    }
    return { success: false };
  }
}

module.exports = UserService;
