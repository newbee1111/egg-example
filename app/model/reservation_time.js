const { generateId } = require('../utils/generateId');
const { arrayToJSON } = require('../utils/arrayToJSON');
const { analizeTime } = require('../utils/analizeTime');
module.exports = app => {
  const { INTEGER, BOOLEAN, STRING, BIGINT, DATE } = app.Sequelize;

  const ReservationTime = app.model.define(
    'bk_visitor_reservation_time',
    {
      id: { type: BIGINT(11), primaryKey: true },
      date: STRING,
      time_start: STRING,
      time_end: STRING,
      number: INTEGER,
      avail_time: DATE,
      is_deleted: BOOLEAN,
    },
    {
      indexes: [{ unique: true, fields: [ 'id' ] }],
    }
  );

  // 由于后台管理还未开始，先由此处生成测试的预约时间段
  ReservationTime.createTestTime = function* () {
    const t = yield app.model.transaction();
    const avail = new Date();
    const { year, month, day } = analizeTime(avail);
    const avail_time = `${year}-${month}-${day}`;
    const date = `${year}-${month}-${day + 6}`;
    const result = yield this.findAll(
      {
        where: {
          date,
          time_start: '12:00',
          time_end: '14:00',
          number: 5,
          is_deleted: false,
        },
      },
      { transaction: t }
    );
    if (!result.length) {
      try {
        // yield this.destroy({});
        const result = yield this.create(
          {
            id: generateId(),
            date,
            time_start: '12:00',
            time_end: '14:00',
            avail_time,
            number: 5,
            is_deleted: false,
          },
          { transaction: t }
        );
        t.commit();
        return result.toJSON();
      } catch (err) {
        yield t.rollback();
      }
    }
    t.commit();
    return arrayToJSON(result, true);
  };

  ReservationTime.checkPersonLimitation = function* (personNum, timeId) {
    let reservation = yield this.findAll({ where: { id: timeId } });
    reservation = arrayToJSON(reservation, true);
    const limit = reservation.number;
    const ReservationModel = app.model.Reservation;
    let reservationLists = yield ReservationModel.findAll({
      where: { reservation_time_id: timeId, is_deleted: false },
    });
    reservationLists = arrayToJSON(reservationLists);
    let total = 0;
    reservationLists.forEach(reservationList => {
      total += reservationList.reservation_number;
    });
    total += personNum;
    if (total > limit) return true;
    return false;
  };

  ReservationTime.getReservationTimeByMonth = function* (minDate, maxDate) {
    let reservationTime = yield this.findAll({
      where: { date: { $gte: minDate, $lt: maxDate }, is_deleted: false },
    });
    reservationTime = arrayToJSON(reservationTime);
    return reservationTime;
  };

  return ReservationTime;
};
