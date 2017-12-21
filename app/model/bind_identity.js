const { generateId } = require('../utils/generateId');
const { arrayToJSON } = require('../utils/arrayToJSON');
module.exports = app => {
  const { BIGINT, BOOLEAN } = app.Sequelize;

  const BindIdentity = app.model.define(
    'bk_visitor_binding_identity',
    {
      id: { type: BIGINT(11), primaryKey: true },
      is_main: BOOLEAN,
      is_delete: BOOLEAN,
    },
    {
      indexes: [{ unique: true, fields: [ 'id', 'user_id', 'identity_id' ] }],
    }
  );
  BindIdentity.associate = () => {
    app.model.BindIdentity.belongsTo(app.model.User, {
      foreignKey: 'user_id',
    });
    app.model.BindIdentity.belongsTo(app.model.Identity, {
      foreignKey: 'identity_id',
    });
  };

  BindIdentity.mainIdentityCheck = function* (id, checkUser = false) {
    let result;
    if (!checkUser) {
      result = yield this.findAll({
        where: { identity_id: id, is_main: true, is_delete: false },
      });
    } else {
      result = yield this.findAll({
        where: { user_id: id, is_main: true, is_delete: false },
      });
    }
    if (!result.length) return true;
    return false;
  };

  BindIdentity.subIdentityCheck = function* (identity_id, user_id) {
    const result = yield this.findAll({
      where: { identity_id, is_main: false, is_delete: false, user_id },
    });
    if (!result.length) return true;
    return false;
  };

  BindIdentity.bindMain = function* (identity, user_id) {
    const { id: identity_id } = identity;
    const t = yield app.model.transaction();
    try {
      const result = yield this.create(
        {
          id: generateId(),
          user_id,
          identity_id,
          is_main: true,
          is_delete: false,
        },
        { transaction: t }
      );
      t.commit();
      return result.toJSON();
    } catch (err) {
      t.rollback();
    }
    t.commit();
    return;
  };

  BindIdentity.getUserAllIdentities = function* (user_id) {
    const allIdentities = yield this.findAll({
      where: { user_id },
      include: [{ model: app.model.Identity }],
    });
    const result = arrayToJSON(allIdentities);
    return result;
  };

  BindIdentity.unbindMain = function* (reqObj) {
    const { user_id, oldIdentity } = reqObj;
    const t = yield app.model.transaction();
    try {
      const result = yield this.destroy(
        {
          where: {
            user_id,
            identity_id: oldIdentity,
            is_main: true,
            is_delete: false,
          },
        },
        { transaction: t }
      );
      t.commit();
      return result;
    } catch (err) {
      yield t.rollback();
    }
    t.commit();
    return;
  };

  BindIdentity.bindSub = function* (identity, user_id) {
    const { id: identity_id } = identity;
    const t = yield app.model.transaction();
    try {
      const result = yield this.create(
        {
          id: generateId(),
          user_id,
          identity_id,
          is_main: false,
          is_delete: false,
        },
        { transaction: t }
      );
      t.commit();
      return result.toJSON();
    } catch (err) {
      t.rollback();
    }
    t.commit();
    return;
  };

  BindIdentity.delSubIdentity = function* (identity_id, user_id) {
    const t = yield app.model.transaction();
    try {
      yield this.destroy(
        {
          where: {
            user_id,
            identity_id,
          },
        },
        { transaction: t }
      );
      t.commit();
      return { success: true };
    } catch (err) {
      t.rollback();
    }
    t.commit();
    return { success: false };
  };

  return BindIdentity;
};
