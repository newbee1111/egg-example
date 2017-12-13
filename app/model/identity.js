module.exports = app => {
  const { STRING, BOOLEAN, ENUM } = app.Sequelize;

  const Identity = app.model.define(
    'bk_visitor_identity',
    {
      id: { type: STRING(255), primaryKey: true },
      full_name: STRING(255),
      identity_card: STRING(255),
      identity_card_type: ENUM('0', '1', '2'),
      is_banned: BOOLEAN,
      is_deleted: BOOLEAN,
    },
    { indexes: [{ unique: true, fields: [ 'id', 'identity_card' ] }] }
  );

  return Identity;
};
