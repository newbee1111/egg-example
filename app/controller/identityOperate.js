const { Controller } = require('egg');

class IdentityOperateController extends Controller {
  * index() {
    const { user } = this.ctx;
    const result = yield this.ctx.service.bindIdentity.getUserAllIdentities(
      user.id
    );
    const mainIdentity = result[0].bk_visitor_identity;
    result.shift();
    const subIdentities = [];
    result.forEach(item => {
      const tempObj = item.bk_visitor_identity;
      subIdentities.push(tempObj);
    });
    yield this.ctx.render('idOperation.ejs', {
      user,
      mainIdentity,
      subIdentities,
    });
  }
  * changeMainIdentity() {
    const { user } = this.ctx;
    const {
      identityCard,
      fullName,
      idType,
      oldIdentity,
    } = this.ctx.request.body;
    const result = yield this.ctx.service.bindIdentity.changeMainIdentity({
      user,
      identityCard,
      fullName,
      idType,
      oldIdentity,
    });
    this.ctx.response.body = result;
  }
}

module.exports = IdentityOperateController;
