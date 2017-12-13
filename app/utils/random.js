const getRandomNumber = (digits = 6) => {
  let res = '';
  for (let i = 1; i <= 2; i++) {
    let number = Math.random();
    number *= 10;
    number = parseInt(number);
    res += number;
  }
  let time = new Date().getTime();
  time = Math.floor(time / 10);
  for (let j = 1; j <= digits - 2; j++) {
    const number = time % 10;
    time = Math.floor(time / 10);
    res += number;
  }
  return res;
};

module.exports = {
  getRandomNumber,
};
