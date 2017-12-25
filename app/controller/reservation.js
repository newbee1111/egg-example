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
    const res = yield this.app.model.ReservationTime.createTestTime();
    const resStartTime = new Date(res.time_start);
    const resEndTime = new Date(res.time_end);
    const startYear = resStartTime.getFullYear();
    const startMonth = resStartTime.getMonth() + 1;
    const startDay = resStartTime.getDate();
    const startHour = resStartTime.getHours();
    const startMin = resStartTime.getMinutes();
    const startSecond = resStartTime.getSeconds();
    const endYear = resEndTime.getFullYear();
    const endMonth = resEndTime.getMonth() + 1;
    const endDay = resEndTime.getDate();
    const endHour = resEndTime.getHours();
    const endMin = resEndTime.getMinutes();
    const endSecond = resEndTime.getSeconds();
    const reservationTime = [];
    reservationTime.push({
      time: `${startYear}-${startMonth}-${startDay} ${startHour}:${startMin}:${startSecond} ~ ${endYear}-${endMonth}-${endDay} ${endHour}:${endMin}:${endSecond}`,
      id: res.id,
      number: res.number,
    });
    yield this.ctx.render('reservation.ejs', {
      user,
      mainIdentity,
      subIdentities,
      reservationTime,
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
    yield this.ctx.render('myReservation.ejs', { user, reservations: result });
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
