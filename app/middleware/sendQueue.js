module.exports = (options, app) => {
  return async (ctx, next) => {
    const { id } = ctx.params;
    const q = app.queueName;
    const queue = app.queue;
    const pass = await queue
      .then(function(ch) {
        return ch.assertQueue(q).then(function() {
          return ch.sendToQueue(q, new Buffer(id));
        });
      })
      .then(res => res)
      .catch(console.warn);
    if (pass) return next();
  };
};
