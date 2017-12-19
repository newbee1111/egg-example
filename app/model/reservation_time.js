module.exports = app => {
  const { INTEGER, BOOLEAN, DATE } = app.Sequelize;

  const ReservationTime = app.model.define(
    'bk_visitor_reservation_time',
    {
      id: { type: INTEGER, primaryKey: true },
      time_start: DATE,
      time_end: DATE,
      number: INTEGER,
      is_deleted: BOOLEAN,
    },
    {
      indexes: [{ unique: true, fields: [ 'id' ] }],
    }
  );

  return ReservationTime;
};
