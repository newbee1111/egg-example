const { app, assert } = require('egg-mock/bootstrap');
const { arrayToJSON } = require('../../../app/utils/arrayToJSON');
const { expect } = require('chai');

describe('test /app/controller/identityOperate', () => {
  const testData = {};
  before(function* () {
    testData.user = yield app.model.User.getOrCreateUser('13063063080');
    yield app.sessionStore.set(testData.user.id, testData.user);
  });
  it('should assert', async () => {
    const pkg = require('../../../package.json');
    assert(app.config.keys.startsWith(pkg.name));
  });
  it('GET /:id/identityOperatePage', async () => {
    const user_id = testData.user.id;
    let res = await app.httpRequest().get(`/${user_id}/identityOperatePage`);
    res = res.toJSON();
    expect(res.status).to.be.equal(200);
    expect(res.text).to.match(/^<!DOCTYPE html>/);
  });

  it('POST /:id/changeMainIdentity', async () => {
    const user_id = testData.user.id;
    const BindIdentityModel = app.model.BindIdentity;
    let oldRes = await BindIdentityModel.findAll({
      where: {
        user_id,
        is_main: true,
        is_delete: false,
      },
    });
    oldRes = arrayToJSON(oldRes, true);
    const oldIdentity = oldRes.id;
    const fullName = 'new Jake.Zhang';
    const idType = '0';
    const identityCard = '123456789';
    let res = await app
      .httpRequest()
      .post(`/${user_id}/changeMainIdentity`)
      .type('json')
      .send({
        oldIdentity,
        fullName,
        idType,
        identityCard,
      });
    res = res.toJSON();
    const body = JSON.parse(res.text);
    expect(body).to.include.keys('success');
    expect(res.status).to.be.equal(200);
  });
});
