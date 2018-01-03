const { app } = require('egg-mock/bootstrap');
const { expect } = require('chai');

describe('test service /app/service/reservation.js', async () => {
  const testObj = {};
  before(function* () {
    const UserModel = app.model.User;
    const user = yield UserModel.getOrCreateUser('123456abc');
    testObj.user = user;
  });

  it('[reservation service] setReservation', function* () {
    const ctx = app.mockContext({
      user: testObj.user,
    });
    const subIdentities = [];
    const testLen = 6;
    const time = yield app.model.ReservationTime.createTestTime();
    const { id: timeId } = time;
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
    let reservers = [];
    res.forEach((item, index) => {
      if (index < 4) reservers.push(item.subIdentity.id);
    });

    let result = yield ctx.service.reservation.setReservation(
      reservers,
      timeId,
      testObj.user
    );

    expect(result.success).to.be.equal(true);
    expect(result.message).to.be.equal('预约成功');
    expect(result).to.include.keys('reservation');

    // test if it can know the person limitation
    reservers = [];
    res.forEach((item, index) => {
      if (index >= 4) reservers.push(item.subIdentity.id);
    });
    result = yield ctx.service.reservation.setReservation(
      reservers,
      timeId,
      testObj.user
    );
    expect(result.success).to.be.equal(false);
    expect(result.message).to.be.equal('该时段的预约人数已达上限');
    expect(result).to.not.include.keys('reservation');

    // test if it can know the repeated reservation
    reservers = [];
    res.forEach((item, index) => {
      if (index < 1) reservers.push(item.subIdentity.id);
    });
    result = yield ctx.service.reservation.setReservation(
      reservers,
      timeId,
      testObj.user
    );
    expect(result.success).to.be.equal(false);
    expect(result.message).to.be.equal('部分身份证已预约');
    expect(result).to.not.include.keys('reservation');
  });

  it('[reservation service] getUserAllReservations', function* () {
    const { id: user_id } = testObj.user;
    const ctx = app.mockContext({
      user: testObj.user,
    });
    const result = yield ctx.service.reservation.getUserAllReservations(
      user_id
    );

    expect(result.length).to.be.equal(1);
    expect(result[0]).to.include.keys('id', 'reservation_number', 'reservers');
  });
});
