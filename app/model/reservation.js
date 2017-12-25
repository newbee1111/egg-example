const { arrayToJSON } = require('../utils/arrayToJSON');
const { generateId } = require('../utils/generateId');
module.exports = app => {
  const { INTEGER, BOOLEAN, BIGINT } = app.Sequelize;

  const Reservation = app.model.define(
    'bk_visitor_reservation',
    {
      id: { type: BIGINT(11), primaryKey: true },
      is_finished: BOOLEAN,
      reservation_number: INTEGER,
      is_deleted: BOOLEAN,
    },
    {
      indexes: [
        { unique: true, fields: [ 'id', 'user_id', 'reservation_time_id' ] },
      ],
    }
  );

  Reservation.associate = () => {
    app.model.Reservation.belongsTo(app.model.User, { foreignKey: 'user_id' });
    app.model.Reservation.belongsTo(app.model.ReservationTime, {
      foreignKey: 'reservation_time_id',
    });
  };

  Reservation.checkTime = function* (reserveLists) {
    const now = new Date();
    let isNotReserved = true;
    if (!reserveLists.length) return !isNotReserved;
    const id = reserveLists[0].reservation_id;

    let reservationTime = yield this.findAll({
      where: { id },
      include: [{ model: app.model.ReservationTime }],
    });
    reservationTime = arrayToJSON(reservationTime, true);
    const res = reservationTime.bk_visitor_reservation_time;
    const { time_end } = res;
    if (now < time_end) {
      isNotReserved = false;
    }

    return !isNotReserved;
  };

  Reservation.setReservation = function* (reservers, timeId, user) {
    const reservation_number = reservers.length;
    const ReservationIdentityModel = app.model.ReservationIdentity;
    const { id: user_id } = user;
    const t = yield app.model.transaction();
    let res = {};
    try {
      res = yield this.create(
        {
          id: generateId(),
          reservation_number,
          user_id,
          is_deleted: false,
          is_finished: false,
          reservation_time_id: timeId,
        },
        { transaction: t }
      );
      res = res.toJSON();
    } catch (err) {
      yield t.rollback();
    }
    const reservation_id = res.id;
    try {
      for (let i = 0; i < reservation_number; i++) {
        yield ReservationIdentityModel.create(
          {
            id: generateId(),
            reservation_id,
            identity_id: reservers[i],
            is_finished: false,
            is_deleted: false,
          },
          { transaction: t }
        );
      }
    } catch (err) {
      yield t.rollback();
    }
    t.commit();
    return res;
  };

  Reservation.getUserAllReservations = function* (user_id) {
    let resArr = yield this.findAll({
      where: { user_id },
      include: [{ model: app.model.ReservationTime }],
      order: [[ app.Sequelize.literal('updated_at', 'asc') ]],
    });
    resArr = arrayToJSON(resArr);
    return resArr;
  };

  Reservation.removeReservation = function* (user_id, reservation_id) {
    const t = yield app.model.transaction();
    const ReservationIdentityModel = app.model.ReservationIdentity;
    try {
      yield this.update(
        { is_deleted: true },
        {
          where: {
            user_id,
            id: reservation_id,
          },
          transaction: t,
        }
      );
    } catch (err) {
      yield t.rollback();
      return { success: false };
    }

    try {
      yield ReservationIdentityModel.update(
        { is_deleted: true },
        { where: { reservation_id }, transaction: t }
      );
    } catch (err) {
      yield t.rollback();
      return { success: false };
    }
    t.commit();

    return { success: true };
  };
  return Reservation;
};
