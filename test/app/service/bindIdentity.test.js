const { app } = require('egg-mock/bootstrap');
const { expect } = require('chai');

describe('test service /app/service/bindIdentity.js', async () => {
  const testObj = {};
  before(function* () {
    const UserModel = app.model.User;
    const openid = 'abcdefg';
    const testUser = yield UserModel.getOrCreateUser(openid);

    testObj.user = testUser;
  });

  it('[bindIdentity service] should can bindIdentity', function* () {
    const ctx = app.mockContext({
      user: testObj.user,
    });
    const mainId = '123456789123456';
    const idType = '0';
    const fullName = 'Jake.Lee';
    const passRes = yield ctx.service.bindIdentity.bindMainAct(
      { mainId, idType, fullName },
      testObj.user
    );
    expect(passRes.success).to.be.equal(true);
    expect(passRes).to.include.keys('identity');
  });

  it('[bindIdentity service] should return fail when id has been binded', function* () {
    const ctx = app.mockContext({ user: testObj.user });
    const mainId = '123456789123456';
    const idType = '0';
    const fullName = 'Jake.Lee';
    const failRes = yield ctx.service.bindIdentity.bindMainAct(
      {
        mainId,
        idType,
        fullName,
      },
      testObj.user
    );

    expect(failRes.success).to.be.equal(false);
    expect(failRes).to.not.include.keys('identity');
  });

  it('[bindIdentity service] getUserAllIdentities should return identities and the mainIdentity should be the first one in the Array', function* () {
    const ctx = app.mockContext({
      user: testObj.user,
    });
    const { id: user_id } = testObj.user;
    const identities = yield ctx.service.bindIdentity.getUserAllIdentities(
      user_id
    );

    expect(identities[0].is_main).to.be.equal(true);
  });

  it("[bindIdentity service] changeMainIdentity should can change user's main identity", function* () {
    const ctx = app.mockContext({
      user: testObj.user,
    });
    const IdentityModel = app.model.Identity;
    const oldMainId = '123456789123456';
    const oldIdType = '0';
    const oldFullName = 'Jake.Lee';
    const oldIdentityObj = yield IdentityModel.getOrCreateIdentity({
      mainId: oldMainId,
      idType: oldIdType,
      fullName: oldFullName,
    });
    const { id: oldIdentity } = oldIdentityObj;
    const identityCard = '123123123123123765756';
    const idType = '2';
    const fullName = 'new Jake.Zhang';
    const passResult = yield ctx.service.bindIdentity.changeMainIdentity({
      oldIdentity,
      identityCard,
      idType,
      fullName,
      user: testObj.user,
    });

    expect(passResult.success).to.be.equal(true);
    expect(passResult).to.include.keys('identity');

    // should return fail when the new identity has been binded
    const failRes = yield ctx.service.bindIdentity.changeMainIdentity({
      oldIdentity,
      identityCard,
      idType,
      fullName,
      user: testObj.user,
    });

    expect(failRes.success).to.be.equal(false);
    expect(failRes).to.not.include.keys('identity');
  });

  it('[bindIdentity service] should can bind subIdentities and filter the same subIdentity', function* () {
    const ctx = app.mockContext({
      user: testObj.user,
    });

    const subIdentities = [];
    const testLen = 5;
    for (let i = 0; i < testLen; i++) {
      const identityCard = `9898${i}`;
      const idType = '0';
      const fullName = `Jake${i}`;
      subIdentities.push({ identityCard, idType, fullName });
    }

    const res = yield ctx.service.bindIdentity.bindSubAct(
      subIdentities,
      testObj.user
    );

    expect(res.length).to.be.equal(5);
    for (let j = 0; j < testLen; j++) {
      expect(res[j].success).to.be.equal(true);
      expect(res[j].subIdentity).to.include.keys(
        'identity_card',
        'identity_card_type',
        'id',
        'full_name'
      );
    }

    // test if it can filter the same subIdentity
    const identityCard = '98980';
    const idType = '0';
    const fullName = 'Jake0';
    const failRes = yield ctx.service.bindIdentity.bindSubAct(
      [{ identityCard, idType, fullName }],
      testObj.user
    );
    expect(failRes.length).to.be.equal(1);
    expect(failRes[0].success).to.be.equal(false);
    expect(failRes[0].subIdentity).to.include.keys(
      'identity_card',
      'identity_card_type',
      'full_name'
    );
  });

  it("[bindIdentity service] should can delete user's subIdentity", function* () {
    const ctx = app.mockContext({
      user: testObj.user,
    });
    const IdentityModel = app.model.Identity;
    const identityObj = yield IdentityModel.getOrCreateIdentity({
      mainId: '98980',
      idType: '0',
      fullName: 'Jake0',
    });
    const result = yield ctx.service.bindIdentity.delSubIdentity(
      identityObj.id,
      testObj.user
    );

    expect(result).to.be.deep.equal({ success: true });
  });
});
