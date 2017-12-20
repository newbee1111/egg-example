const { Service } = require('egg');

class IdentityService extends Service {
  * getOrCreateIdentity(identity_mes) {
    const IdentityModel = this.app.model.Identity;
    const result = yield IdentityModel.getOrCreateIdentity(identity_mes);
    return result;
  }
}

module.exports = IdentityService;
