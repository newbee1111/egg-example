const { app, assert } = require('egg-mock/bootstrap');
const { expect } = require('chai');
const { arrayToJSON } = require('../../../app/utils/arrayToJSON');

describe('test controller /app/controller/bindIdentity.js', () => {
  const testData = {};
  before(function* () {
    testData.user = yield app.model.User.getOrCreateUser('13063063080');
    yield app.sessionStore.set(testData.user.id, testData.user);
  });

  it('should assert', async () => {
    const pkg = require('../../../package.json');
    assert(app.config.keys.startsWith(pkg.name));
  });

  it('GET /:id/bindMainPage', function* () {
    const user_id = testData.user.id;
    const result = yield app
      .httpRequest()
      .get(`/${user_id}/bindMainPage`)
      .type('json');
    assert(result.status === 200 && result.type === 'text/html');
  });

  it('POST /:id/bindMainAct', async () => {
    const user_id = testData.user.id;
    const mainId = '123456';
    const fullName = 'Jake.Zhang';
    const idType = '0';
    let res = await app
      .httpRequest()
      .post(`/${user_id}/bindMainAct`)
      .type('json')
      .send({ mainId, fullName, idType });
    res = res.toJSON();
    const body = JSON.parse(res.text);
    expect(res.status).to.be.equal(200);
    expect(body).to.include.keys('success');
  });

  it('POST /:id/bindSubIdentities', async () => {
    const { id: user_id } = testData.user;
    const testLen = 3;
    const subIdentities = [];
    for (let i = 0; i < testLen; i++) {
      const subIdentity = {
        mainId: `a12345123123123${i}`,
        idType: '0',
        fullName: `ZCF${i}`,
      };

      subIdentities.push(subIdentity);
    }
    let res = await app
      .httpRequest()
      .post(`/${user_id}/bindSubIdentities`)
      .type('json')
      .send({ subIdentities });

    res = res.toJSON();
    const body = JSON.parse(res.text);
    expect(res.status).to.be.equal(200);
    expect(body.length).to.be.equal(testLen);
    body.forEach(item => {
      expect(item).to.include.keys('subIdentity');
    });
  });

  it('POST /:id/delSubIdentity', async () => {
    const BindIdentityModel = app.model.BindIdentity;
    const { id: user_id } = testData.user;
    const subIdentities = await BindIdentityModel.findAll({
      where: {
        user_id,
        is_main: false,
        is_delete: false,
      },
    });
    const subIdentity = arrayToJSON(subIdentities, true);
    const { identity_id } = subIdentity;
    let res = await app
      .httpRequest()
      .post(`/${user_id}/delSubIdentity`)
      .type('json')
      .send({
        identity_id,
      });
    res = res.toJSON();
    const body = JSON.parse(res.text);

    expect(res.status).to.be.equal(200);
    expect(body).to.be.deep.equal({ success: true });
  });
});
