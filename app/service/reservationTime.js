const { Service } = require('egg');

class ReservationTimeService extends Service {
  * getReservationTimeByMonth(year, month) {
    // date should contain year and month
    // createTestTime
    const minDate = `${year}-${month}-01`;
    const maxDate = `${year}-${month + 1}-01`;
    const ReservationTimeModel = this.app.model.ReservationTime;
    const reservationTime = yield ReservationTimeModel.getReservationTimeByMonth(
      minDate,
      maxDate
    );
    return reservationTime;
  }
}

module.exports = ReservationTimeService;
