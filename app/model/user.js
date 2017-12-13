const ObjectId = require('objectid');

module.exports = app => {
  const { STRING, INTEGER, BOOLEAN } = app.Sequelize;

  const User = app.model.define(
    'bk_visitor_user',
    {
      id: { type: STRING(255), primaryKey: true },
      cellphone: STRING(255),
      credit: INTEGER,
      is_banned: BOOLEAN,
      is_deleted: BOOLEAN,
    },
    {
      indexes: [{ unique: true, fields: [ 'id', 'cellphone' ] }],
    }
  );

  User.getOrCreateUser = function* (cellphone) {
    const user = yield this.findOne({ cellphone });
    if (!user) {
      const user_id = yield this.create({
        id: ObjectId().toString(),
        cellphone,
        credit: 100,
        is_banned: false,
        is_deleted: false,
      });
      return user_id;
    }
    return user;
  };

  return User;
};
