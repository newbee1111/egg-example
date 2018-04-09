const { Service } = require('egg');
const { reformTime } = require('../utils/analizeTime');

class ReservationService extends Service {
  * setReservation(reservers, timeId, user) {
    const ReservationIdentityModel = this.app.model.ReservationIdentity;
    const ReservationTimeModel = this.app.model.ReservationTime;
    const ReservationModel = this.app.model.Reservation;
    const len = reservers.length;
    for (let i = 0; i < len; i++) {
      const isReserved = yield ReservationIdentityModel.checkUserReserved(
        reservers[i]
      );
      if (isReserved) return { success: false, message: '部分身份证已预约' };
    }
    const isFull = yield ReservationTimeModel.checkPersonLimitation(
      len,
      timeId
    );
    if (isFull) return { success: false, message: '该时段的预约人数已达上限' };
    const reserveSuccess = yield ReservationModel.setReservation(
      reservers,
      timeId,
      user
    );
    return { success: true, message: '预约成功', reservation: reserveSuccess };
  }
  * getUserAllReservations(user_id) {
    const ReservationModel = this.app.model.Reservation;
    const ReservationIdentityModel = this.app.model.ReservationIdentity;
    const reservationsArr = yield ReservationModel.getUserAllReservations(
      user_id
    );
    const len = reservationsArr.length;
    for (let i = 0; i < len; i++) {
      const reservation_id = reservationsArr[i].id;
      const reservers = yield ReservationIdentityModel.getReserversOfReservation(
        reservation_id
      );
      reservationsArr[i].reservers = reservers;
    }

    const currentReservations = [];
    const historyReservations = [];
    reservationsArr.forEach(item => {
      const { bk_visitor_reservation_time: time, is_deleted } = item;
      const { date, time_end, time_start } = time;
      const dateArr = date.split('-');
      const [ year, month, day ] = [ ...dateArr ];
      const hourArr = time_end.split(':');
      const [ hour, min ] = [ ...hourArr ];
      const reformedDate = reformTime({ year, month, day, hour, min });
      item.timeStr = `${date} ${time_start}~${time_end}`;
      if (reformedDate >= new Date() && !is_deleted) {
        currentReservations.push(item);
      } else historyReservations.push(item);
    });

    return { currentReservations, historyReservations };
  }

  * cancelReservationPerson(reservation_id, reserver_id, user_id) {
    const ReservationModel = this.app.model.Reservation;
    const result = yield ReservationModel.removeReservationPerson(
      reservation_id,
      reserver_id,
      user_id
    );
    const { success } = result;
    if (!success) return { success, message: '预约开始前一天之后无法取消预约' };
    return { success, message: '取消预约成功' };
  }

  * cancelReservation(user_id, reservation_id) {
    const ReservationModel = this.app.model.Reservation;
    const result = yield ReservationModel.removeReservation(
      user_id,
      reservation_id
    );
    const { success } = result;
    if (!success) return { success, message: '预约开始前一天之后无法取消预约' };
    return { success, message: '取消预约成功' };
  }
}

module.exports = ReservationService;
