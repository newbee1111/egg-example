const { Service } = require('egg');

class BindIdentityService extends Service {
  * bindMainAct(identity_mes, user, skipCheck = false, identityObj) {
    const { mainId, fullName, idType } = identity_mes;
    const { id: user_id } = user;
    const BindIdentityModel = this.app.model.BindIdentity;
    let identity;
    if (identityObj) {
      identity = identityObj;
    } else {
      identity = yield this.ctx.service.identity.getOrCreateIdentity({
        mainId,
        fullName,
        idType,
      });
    }
    if (skipCheck) {
      yield BindIdentityModel.bindMain(identity, user_id);
      return { identity, success: true };
    }
    const notBinded = yield BindIdentityModel.mainIdentityCheck(identity.id);
    if (notBinded) {
      yield BindIdentityModel.bindMain(identity, user_id);
      return { identity, success: true };
    }
    // 失败说明该身份证已经被绑定到了其他手机号上
    const result = { success: false };
    return result;
  }
  * getUserAllIdentities(user_id) {
    const BindIdentityModel = this.app.model.BindIdentity;
    const preRes = yield BindIdentityModel.getUserAllIdentities(user_id);
    const result = [];
    preRes.forEach(async item => {
      const { user_id: owner, is_main } = item;
      if (is_main && owner === user_id) {
        result.unshift(item);
      } else {
        result.push(item);
      }
    });
    return result;
  }
  * changeMainIdentity(requestObj) {
    const BindIdentityModel = this.app.model.BindIdentity;
    const { user, oldIdentity, fullName, idType, identityCard } = requestObj;
    const identity = yield this.ctx.service.identity.getOrCreateIdentity({
      mainId: identityCard,
      fullName,
      idType,
    });
    const notBinded = yield BindIdentityModel.mainIdentityCheck(identity.id);
    if (!notBinded) return { success: false };
    yield BindIdentityModel.unbindMain({
      user_id: user.id,
      oldIdentity,
    });
    const result = yield this.bindMainAct(
      { fullName, idType, mainId: identityCard },
      user,
      true,
      identity
    );
    return result;
  }
  * bindSubAct(subIdentities, user) {
    const BindIdentityModel = this.app.model.BindIdentity;
    const IdentityModel = this.app.model.Identity;
    const len = subIdentities.length;
    const { id: user_id } = user;
    const idRes = [];
    for (let i = 0; i < len; i++) {
      const { identityCard: mainId, idType, fullName } = subIdentities[i];
      const subIdentity = yield IdentityModel.getOrCreateIdentity({
        mainId,
        idType,
        fullName,
      });
      const notBinded = yield BindIdentityModel.subIdentityCheck(
        subIdentity.id,
        user_id
      );
      if (notBinded) {
        yield BindIdentityModel.bindSub(subIdentity, user_id);
        idRes.push({ subIdentity, success: true });
      } else {
        // 失败说明这个身份证已经被绑定过在这个用户上了
        idRes.push({ subIdentity, success: false });
      }
    }
    const result = idRes;
    return result;
  }
  * delSubIdentity(identity_id, user) {
    const { id: user_id } = user;
    const BindIdentityModel = this.app.model.BindIdentity;
    const result = yield BindIdentityModel.delSubIdentity(identity_id, user_id);
    return result;
  }
}

module.exports = BindIdentityService;
