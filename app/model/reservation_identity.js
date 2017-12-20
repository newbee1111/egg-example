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
  return ReservationIdentity;
};
