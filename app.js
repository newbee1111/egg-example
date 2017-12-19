// 强制按照model生成表，开发环境下才使用
module.exports = app => {
  if (app.config.env === 'local') {
    app.beforeStart(async () => {
      await app.model.sync({ force: true });
    });
  }

  app.sessionStore = {
    * get(key) {
      const res = yield app.redis.get(key);
      if (!res) return null;
      return JSON.parse(res);
    },
    * set(key, value, maxAge = 24 * 60 * 60 * 1000) {
      const target = JSON.stringify(value);
      yield app.redis.set(key, target, 'PX', maxAge);
    },
    * destroy(key) {
      yield app.redis.del(key);
    },
  };
};
