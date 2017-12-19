module.exports = app => {
  const { INTEGER, BOOLEAN } = app.Sequelize;

  const Reservation = app.model.define(
    'bk_visitor_reservation',
    {
      id: { type: INTEGER, primaryKey: true },
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
  return Reservation;
};
