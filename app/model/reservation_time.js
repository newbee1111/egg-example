const { generateId } = require('../utils/generateId');
const { arrayToJSON } = require('../utils/arrayToJSON');
module.exports = app => {
  const { INTEGER, BOOLEAN, DATE, BIGINT } = app.Sequelize;

  const ReservationTime = app.model.define(
    'bk_visitor_reservation_time',
    {
      id: { type: BIGINT(11), primaryKey: true },
      time_start: DATE,
      time_end: DATE,
      number: INTEGER,
      is_deleted: BOOLEAN,
    },
    {
      indexes: [{ unique: true, fields: [ 'id' ] }],
    }
  );

  // 由于后台管理还未开始，先由此处生成测试的预约时间段
  ReservationTime.createTestTime = function* () {
    const t = yield app.model.transaction();
    const result = yield this.findAll(
      {
        where: {
          time_start: new Date('1 1,2018 12:00:00'),
          time_end: new Date('1 1,2018 14:00:00'),
          number: 5,
          is_deleted: false,
        },
      },
      { transaction: t }
    );
    if (!result.length) {
      try {
        const result = yield this.create(
          {
            id: generateId(),
            time_start: new Date('1 1,2018 12:00:00'),
            time_end: new Date('1 1,2018 14:00:00'),
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

  return ReservationTime;
};
