// 强制按照model生成表，开发环境下才使用
module.exports = app => {
  if (app.config.env === 'local') {
    app.beforeStart(async () => {
      await app.model.sync({ force: true });
    });
  }
};
