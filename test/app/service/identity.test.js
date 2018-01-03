const { app } = require('egg-mock/bootstrap');
const { expect } = require('chai');

describe('test service /app/service/identity.js', async () => {
  it('[identity service] should getOrCreate an identity', function* () {
    const testMes = {
      fullName: 'Jake.Zhang',
      mainId: '123456',
      idType: '0',
    };
    const ctx = app.mockContext();
    const result = yield ctx.service.identity.getOrCreateIdentity(testMes);
    expect(result).to.include.keys(
      'id',
      'full_name',
      'identity_card',
      'identity_card_type'
    );
    expect(result.identity_card).to.be.equal('123456');
  });
});
