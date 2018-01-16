const { generateId } = require('../utils/generateId');
const { arrayToJSON } = require('../utils/arrayToJSON');

module.exports = app => {
  const { STRING, INTEGER, BOOLEAN, BIGINT } = app.Sequelize;

  const User = app.model.define(
    'bk_visitor_user',
    {
      id: { type: BIGINT(11), primaryKey: true },
      cellphone: STRING(255),
      credit: INTEGER,
      is_banned: BOOLEAN,
      is_deleted: BOOLEAN,
      open_id: STRING(255),
    },
    {
      indexes: [{ unique: true, fields: [ 'id', 'cellphone', 'open_id' ] }],
    }
  );

  User.getOrCreateUser = function* (openid) {
    const t = yield app.model.transaction();
    const user = yield this.findAll(
      { where: { open_id: openid } },
      { transaction: t }
    );
    if (!user.length) {
      try {
        const user = yield this.create(
          {
            id: parseInt(generateId()),
            open_id: openid,
            credit: 100,
            is_banned: false,
            is_deleted: false,
          },
          { transaction: t }
        );
        t.commit();
        return user.toJSON();
      } catch (err) {
        yield t.rollback();
      }
    }
    t.commit();
    return arrayToJSON(user, true);
  };

  return User;
};
