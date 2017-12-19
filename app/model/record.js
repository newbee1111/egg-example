module.exports = app => {
  const { INTEGER, TEXT, BOOLEAN } = app.Sequelize;

  const Record = app.model.define(
    'bk_visitor_user_record',
    {
      id: { type: INTEGER, primaryKey: true },
      property: INTEGER,
      description: TEXT,
      is_deleted: BOOLEAN,
    },
    {
      indexes: [{ unique: true, fields: [ 'id', 'user_id' ] }],
    }
  );
  Record.associate = function() {
    app.model.Record.belongsTo(app.model.User, { foreignKey: 'user_id' });
  };

  return Record;
};
