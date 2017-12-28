const { app, assert } = require('egg-mock/bootstrap');
const jwt = require('jsonwebtoken');
setTimeout(() => {
  describe('test controller /app/controller/user.js', () => {
    it('should assert', function* () {
      const pkg = require('../../../package.json');
      assert(app.config.keys.startsWith(pkg.name));

      // const ctx = app.mockContext({});
      // yield ctx.service.xx();
    });
    after(async () => {
      const BindIdentityModel = app.model.BindIdentity;
      const IdentityModel = app.model.Identity;
      const ReservationModel = app.model.Reservation;
      const UserModel = app.model.User;
      const ReservationIdentityModel = app.model.ReservationIdentity;
      await ReservationIdentityModel.destroy({ where: {} });
      await UserModel.destroy({ where: {} });
      await ReservationModel.destroy({ where: {} });
      await IdentityModel.destroy({ where: {} });
      await BindIdentityModel.destroy({ where: {} });
    });
    it('GET /', async () => {
      const result = await app.httpRequest().get('/');
      assert(result.status === 200 && result.type === 'text/html');
    });

    it('POST /getMes', async () => {
      const result = await app
        .httpRequest()
        .post('/getMes')
        .type('json')
        .send({ tel: '13063063080' });
      assert(result.status === 200 && result.type === 'application/json');
      assert(
        result.body.tel === '13063063080' &&
					result.body.validateCode === '123456' &&
					typeof result.body.expireTime === 'number'
      );
    });

    it('POST /login', async () => {
      const expireTime = Math.floor(new Date().getTime() / 1000);
      const expireResult = await app
        .httpRequest()
        .post('/login')
        .type('json')
        .send({
          tel: '13063063080',
          expireTime,
        });
      assert(
        expireResult.status === 200 && expireResult.type === 'application/json'
      );
      assert(
        expireResult.body.success === false &&
					!expireResult.body.token &&
					!expireResult.body.user
      );

      const passResult = await app
        .httpRequest()
        .post('/login')
        .type('json')
        .send({
          tel: '13063063080',
          expireTime: expireTime + 10e5,
        });
      assert(
        passResult.status === 200 && passResult.type === 'application/json'
      );
      assert(
        passResult.body.success === true &&
					passResult.body.token &&
					passResult.body.user
      );
    });

    it('POST /token', async () => {
      const expireToken = jwt.sign(
        {
          tel: '13063063080',
          exp: Math.floor(new Date().getTime() / 1000 - 1),
        },
        'secret'
      );
      const expireResult = await app
        .httpRequest()
        .post('/token')
        .type('json')
        .send({
          token: expireToken,
        });

      assert(
        expireResult.status === 200 && expireResult.type === 'application/json'
      );
      assert(expireResult.body.success === false);

      const passToken = jwt.sign({ tel: '13063063080' }, 'secret', {
        expiresIn: '10s',
      });

      const passResult = await app
        .httpRequest()
        .post('/token')
        .type('json')
        .send({ token: passToken });
      assert(
        passResult.status === 200 && passResult.type === 'application/json'
      );
      assert(passResult.body.success === true && passResult.body.user);
    });
  });

  run();
}, 2000);
