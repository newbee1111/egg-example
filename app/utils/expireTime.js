const getExpireTime = validateTime => {
  const now = Math.floor(new Date().getTime() / 1000);
  return now + validateTime;
};

const getNowSeconds = () => {
  const now = Math.floor(new Date().getTime() / 1000);
  return now;
};

module.exports = { getExpireTime, getNowSeconds };
