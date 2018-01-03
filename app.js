// 强制按照model生成表，开发环境下才使用
module.exports = app => {
  // if (app.config.env === 'local') {
  //   app.beforeStart(async () => {
  //     await app.model.sync({ force: true });
  //   });
  // }

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
      return ch.assertQueue(q).then(function() {
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

  // 构造微信signature等参数
  // const appId = 'wx05630fac5042a808';
  // const AppSecret = 'f8d5e0712eaf190b06ec731d3f3b8b2c';
  // app.sessionStore.get('signature').then(async res => {
  //   if (!res) {
  //     const accessTokenRes = await app.curl(
  //       `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${appId}&secret=${AppSecret}`
  //     );
  //     const { data: access_token } = accessTokenRes;
  //     const ticketRes = await app.curl(
  //       `https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=${access_token}&type=jsapi`
  //     );

  //     const { data: ticket } = ticketRes;
  //     const nonceStr = Math.random()
  //       .toString(36)
  //       .substr(2, 15);
  //     const timeStamp = parseInt(new Date().getTime() / 1000) + '';
  //     const url = 'http://'
  //     const str = `jsapi_ticket=${ticket}&noncestr=${nonceStr}&timestamp=${timeStamp}`;
  //     console.log(ticket);
  //   }
  // });
};
