module.exports = app => {
  const { INTEGER, BOOLEAN } = app.Sequelize;

  const BindIdentity = app.model.define(
    'bk_visitor_binding_identity',
    {
      id: { type: INTEGER, primaryKey: true },
      is_main: BOOLEAN,
      is_delete: BOOLEAN,
    },
    {
      indexes: [{ unique: true, fields: [ 'id', 'user_id', 'identity_id' ] }],
    }
  );
  BindIdentity.associate = () => {
    // app.model.Identity.belongsToMany(app.model.User, {
    //   through: app.model.BindIdentity,
    //   foreignKey: 'identity_id',
    // });
    // app.model.User.belongsToMany(app.model.Identity, {
    //   through: app.model.BindIdentity,
    //   foreignKey: 'user_id',
    // });
    app.model.BindIdentity.belongsTo(app.model.User, {
      foreignKey: 'user_id',
    });
    app.model.BindIdentity.belongsTo(app.model.Identity, {
      foreignKey: 'identity_id',
    });
  };

  return BindIdentity;
};
