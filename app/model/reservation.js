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
    console.log(res);
    const { date, time_end } = res;
    const dateArr = date.split('-');
    const year = dateArr[0];
    const month = dateArr[1];
    const day = dateArr[2];
    const endDate = new Date(`${month} ${day},${year} ${time_end}`);
    if (now < endDate) {
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
      order: [[ app.Sequelize.literal('updated_at DESC') ]],
    });
    resArr = arrayToJSON(resArr);
    return resArr;
  };

  const canDeleteReservation = function* (reservation_id) {
    const ReservationModel = app.model.Reservation;
    let reservation = yield ReservationModel.findAll({
      where: { id: reservation_id },
    });
    reservation = arrayToJSON(reservation);
    const { date, time_start } = reservation.bk_visitor_reservation_time;
    const dateArr = date.split('-');
    const [ year, month, day ] = [ ...dateArr ];
    const canDeleteDay = 1; // 目前简单设定为预约开始的前一天不能取消预约
    const miliSeconds = canDeleteDay * 24 * 3600 * 1000;
    const now = new Date();
    const reserveDate = new Date(`${month} ${day},${year} ${time_start}`);
    const canDeleteDate = new Date(reserveDate.getTime() - miliSeconds);
    if (now >= canDeleteDate) return false;
    return reservation;
  };

  const checkLastPerson = function* (reservation_id) {
    let reservation = yield this.findAll({
      id: reservation_id,
    });
    reservation = arrayToJSON(reservation);
    const { reservation_number } = reservation;
    if (reservation_number === 1) return true;
    return false;
  };

  Reservation.removeReservationPerson = function* (
    reservation_id,
    reserver_id,
    user_id
  ) {
    const reservation = canDeleteReservation(reservation_id);
    if (!reservation) return { success: false };
    if (checkLastPerson(reservation_id)) {
      yield this.removeReservation(user_id, reservation_id);
      return { success: true };
    }
    const t = yield app.model.transaction();
    const ReservationIdentityModel = app.model.ReservationIdentity;
    try {
      yield ReservationIdentityModel.destroy({
        where: {
          reservation_id,
          identity_id: reserver_id,
          is_deleted: false,
        },
        transaction: t,
      });
    } catch (err) {
      yield t.rollback();
      return { success: false };
    }

    try {
      let { reservation_number } = reservation;
      reservation_number--;
      yield this.update(
        { reservation_number },
        { where: { id: reservation_id, is_deleted: false }, transaction: t }
      );
    } catch (err) {
      yield t.rollback();
      return { success: false };
    }

    t.commit();
    return { success: true };
  };

  Reservation.removeReservation = function* (user_id, reservation_id) {
    const canDelete = canDeleteReservation(reservation_id);
    if (!canDelete) return { success: false };
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
