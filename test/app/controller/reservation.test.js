const { app } = require('egg-mock/bootstrap');
const { expect } = require('chai');
const { arrayToJSON } = require('../../../app/utils/arrayToJSON');

describe('test controller /app/controller/reservation', () => {
  const testData = {};
  before(function* () {
    testData.user = yield app.model.User.getOrCreateUser('13063063080');
    yield app.sessionStore.set(testData.user.id, testData.user);
  });
  it('GET /:id/reservationPage', async () => {
    const { id: user_id } = testData.user;
    let res = await app.httpRequest().get(`/${user_id}/reservationPage`);
    res = res.toJSON();

    expect(res.status).to.be.equal(200);
    expect(res.text).to.match(/^<!DOCTYPE html>/);
  });

  it('POST /:id/reservation', function* () {
    const { id: user_id } = testData.user;
    const testTime = yield app.model.ReservationTime.createTestTime();
    const { id: timeId } = testTime;
    const BindIdentityModel = app.model.BindIdentity;
    let resArr = yield BindIdentityModel.findAll({
      where: {
        user_id,
        is_deleted: false,
      },
    });
    resArr = arrayToJSON(resArr);
    const reservers = resArr.map(item => item.identity_id);
    let res = yield app
      .httpRequest()
      .post(`/${user_id}/reservation`)
      .type('json')
      .send({
        reservers,
        timeId,
      });

    res = res.toJSON();
    const body = JSON.parse(res.text);
    expect(res.status).to.be.equal(200);
    expect(body).to.include.keys('success', 'message');
  });

  it('GET /:id/myReservationPage', async () => {
    const { id: user_id } = testData.user;
    let res = await app.httpRequest().get(`/${user_id}/myReservationPage`);
    res = res.toJSON();

    expect(res.status).to.be.equal(200);
    expect(res.text).to.match(/^<!DOCTYPE html>/);
  });

  it('POST /:id/cancelReservation', function* () {
    const { id: user_id } = testData.user;
    const ReservationModel = app.model.Reservation;
    let res = yield ReservationModel.findAll({
      where: {
        user_id,
        is_deleted: false,
      },
    });
    res = arrayToJSON(res, true);
    const { id: reservation_id } = res;
    let result = yield app
      .httpRequest()
      .post(`/${user_id}/cancelReservation`)
      .send({
        reservation_id,
      });
    result = result.toJSON();
    const body = JSON.parse(result.text);
    expect(result.status).to.be.equal(200);
    expect(body).to.be.deep.equal({ success: true, message: '取消预约成功' });
  });
});
