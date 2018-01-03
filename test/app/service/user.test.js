const { app } = require('egg-mock/bootstrap');
const { expect } = require('chai');

describe('test service /app/service/user.js', async () => {
  const testObj = {};
  before(function* () {
    const UserModel = app.model.User;
    const openid = 'abc123';
    const user = yield UserModel.getOrCreateUser(openid);
    testObj.user = user;
  });

  it('[user service] registryOrLogin should getOrCreateUser', function* () {
    const ctx = app.mockContext({
      user: testObj.user,
    });
    const openid = '123abc';
    const createRes = yield ctx.service.user.registryOrLogin(openid);
    expect(createRes).to.include.keys('id', 'open_id');
    const getRes = yield ctx.service.user.registryOrLogin(testObj.user.openid);
    expect(getRes).to.include.keys('id', 'open_id');
  });

  it('[user service] mainIdentityCheck should know user already bind mainIdentity', function* () {
    const ctx = app.mockContext({
      user: testObj.user,
    });
    const user_id = testObj.user.id;
    const result = yield ctx.service.user.mainIdentityCheck(user_id);
    expect(result).to.be.equal(true);
  });
});
