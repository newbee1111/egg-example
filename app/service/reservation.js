const { Service } = require('egg');

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

    return reservationsArr;
  }

  * cancelReservation(user_id, reservation_id) {
    const ReservationModel = this.app.model.Reservation;

    const result = yield ReservationModel.removeReservation(
      user_id,
      reservation_id
    );

    return result;
  }
}

module.exports = ReservationService;
