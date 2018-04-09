const { arrayToJSON } = require('../utils/arrayToJSON');
module.exports = app => {
  const { BIGINT, BOOLEAN } = app.Sequelize;

  const ReservationIdentity = app.model.define(
    'bk_visitor_reservation_identity',
    {
      id: { type: BIGINT, primaryKey: true },
      is_finished: BOOLEAN,
      is_deleted: BOOLEAN,
    },
    {
      indexes: [
        { unique: true, fields: [ 'id', 'reservation_id', 'identity_id' ] },
      ],
    }
  );

  ReservationIdentity.associate = () => {
    app.model.ReservationIdentity.belongsTo(app.model.Reservation, {
      foreignKey: 'reservation_id',
    });
    app.model.ReservationIdentity.belongsTo(app.model.Identity, {
      foreignKey: 'identity_id',
    });
  };

  ReservationIdentity.checkUserReserved = function* (reserver) {
    const ReservationModel = app.model.Reservation;
    let reserveList = yield this.findAll({
      where: {
        is_deleted: false,
        identity_id: reserver,
        is_finished: false,
      },
    });
    reserveList = arrayToJSON(reserveList);
    const isReserved = yield ReservationModel.checkTime(reserveList);
    return isReserved;
  };

  ReservationIdentity.getReserversOfReservation = function* (reservation_id) {
    let resArr = yield this.findAll({
      where: { reservation_id },
      include: [{ model: app.model.Identity }],
      order: [[ app.Sequelize.literal('updated_at', 'desc') ]],
    });
    resArr = arrayToJSON(resArr);

    return resArr;
  };
  return ReservationIdentity;
};
