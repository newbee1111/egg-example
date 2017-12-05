'use strict';

// had enabled by egg
// exports.static = true;
exports.ejs = {
  enable: true,
  package: 'egg-view-ejs',
};

exports.mysql = {
  enable: true,
  package: 'egg-mysql',
};

exports.sequelize = {
  enable: true,
  package: 'egg-sequelize',
};

exports.redis = {
  enable: true,
  package: 'egg-redis',
};

exports.sessionRedis = {
  enable: true,
  package: 'egg-session-redis',
};
