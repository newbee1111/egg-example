const { Controller } = require('egg');

class BindIdentityController extends Controller {
  * bindMainPage() {
    const { user } = this.ctx;
    yield this.ctx.render('mainIdentityBind.ejs', { user });
  }
  * bindMainAct() {
    const { mainId, fullName, idType } = this.ctx.request.body;
    const { user } = this.ctx;
    const result = yield this.ctx.service.bindIdentity.bindMainAct(
      { mainId, fullName, idType },
      user
    );
    this.ctx.response.body = result;
  }
  * bindSubAct() {
    const { subIdentities } = this.ctx.request.body;
    const { user } = this.ctx;
    const result = yield this.ctx.service.bindIdentity.bindSubAct(
      subIdentities,
      user
    );
    this.ctx.response.body = result;
  }
  * delSubIdentity() {
    const { identity_id } = this.ctx.request.body;
    const { user } = this.ctx;
    const result = yield this.ctx.service.bindIdentity.delSubIdentity(
      identity_id,
      user
    );
    this.ctx.response.body = result;
  }
}

module.exports = BindIdentityController;
