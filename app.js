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

  // 消息队列
  const q = 'tasks';
  const open = require('amqplib').connect('amqp://localhost');
  app.queue = open.then(function(conn) {
    return conn.createChannel();
  });
  app.queue
    .then(function(ch) {
      return ch.assertQueue(q).then(function(ok) {
        return ch.consume(q, function(msg) {
          if (msg !== null) {
            console.log(msg.content.toString());
            ch.ack(msg);
            return 'it is very interesting';
          }
          return false;
        });
      });
    })
    .catch(console.warn);

  app.queueName = q;
};
