'use strict';

module.exports = appInfo => {
  const config = (exports = {});

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1512351319854_8100';

  // add your config here
  config.middleware = [];

  config.view = {
    defaultViewEngine: 'ejs',
    mapping: {
      ejs: 'ejs',
    },
  };
  config.mysql = {
    client: {
      host: 'localhost',
      port: '3306',
      user: 'root',
      password: '',
      database: 'eggjs',
    },
    app: true, // 将mysql作为属性绑定到app对象上
    agent: false,
  };
  config.security = {
    csrf: {
      enable: false,
    },
  };
  return config;
};
