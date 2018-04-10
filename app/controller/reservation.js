const { Controller } = require('egg');

class ReservationController extends Controller {
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
    // 获取测试用的预约时间
    yield this.app.model.ReservationTime.createTestTime();
    const res = yield this.ctx.service.reservationTime.getReservationTimeByMonth(
      '2018',
      '04'
    );
    yield this.ctx.render('reservation.ejs', {
      user,
      mainIdentity,
      subIdentities,
      reservationTime: res,
    });
  }
  * setReservation() {
    const { user } = this.ctx;
    const { reservers, timeId } = this.ctx.request.body;
    const result = yield this.ctx.service.reservation.setReservation(
      reservers,
      timeId,
      user
    );
    this.ctx.response.body = result;
  }
  * myReservationPage() {
    const { user } = this.ctx;
    const { id: user_id } = user;
    const result = yield this.ctx.service.reservation.getUserAllReservations(
      user_id
    );
    const { currentReservations, historyReservations } = result;
    yield this.ctx.render('myReservation.ejs', {
      user,
      currentReservations,
      historyReservations,
    });
  }
  * cancelReservationPerson() {
    const { user } = this.ctx;
    const { id: user_id } = user;
    const { reservation_id, reserver_id } = this.ctx.request.body;
    const result = yield this.ctx.service.reservation.cancelReservationPerson(
      reservation_id,
      reserver_id,
      user_id
    );
    this.ctx.response.body = result;
  }
  * cancelReservation() {
    const { user } = this.ctx;
    const { id: user_id } = user;
    const { reservation_id } = this.ctx.request.body;
    const result = yield this.ctx.service.reservation.cancelReservation(
      user_id,
      reservation_id
    );

    this.ctx.response.body = result;
  }
}

module.exports = ReservationController;
