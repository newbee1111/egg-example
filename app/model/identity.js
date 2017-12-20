const { generateId } = require('../utils/generateId');
const { arrayToJSON } = require('../utils/arrayToJSON');
module.exports = app => {
  const { STRING, BIGINT, BOOLEAN, ENUM } = app.Sequelize;

  const Identity = app.model.define(
    'bk_visitor_identity',
    {
      id: { type: BIGINT(11), primaryKey: true },
      full_name: STRING(255),
      identity_card: STRING(255),
      identity_card_type: ENUM('0', '1', '2'),
      is_banned: BOOLEAN,
      is_deleted: BOOLEAN,
    },
    { indexes: [{ unique: true, fields: [ 'id', 'identity_card' ] }] }
  );

  Identity.getOrCreateIdentity = function* (identity_mes) {
    const { mainId, idType, fullName } = identity_mes;
    const t = yield app.model.transaction();
    let identity = yield this.findAll(
      {
        where: {
          identity_card: mainId,
          identity_card_type: idType,
          full_name: fullName,
        },
      },
      { transaction: t }
    );

    if (!identity.length) {
      try {
        identity = yield this.create({
          id: generateId(),
          full_name: fullName,
          identity_card: mainId,
          identity_card_type: idType,
          is_banned: false,
          is_deleted: false,
        });
        t.commit();
        return identity.toJSON();
      } catch (err) {
        yield t.rollback();
      }
    }
    t.commit();
    return arrayToJSON(identity, true);
  };
  return Identity;
};
