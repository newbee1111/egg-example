module.exports = (options, app) => {
  return async (ctx, next) => {
    const { id } = ctx.params;
    const user = await app.sessionStore.get(id);
    if (!user) {
      return ctx.redirect('/');
    }
    ctx.user = user;
    return next();
  };
};
