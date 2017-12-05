const getRandomNumber = digits => {
  let res = '';
  let number = Math.random();
  for (let i = 1; i <= digits; i++) {
    number *= 10;
    number = parseInt(number);
    res += number;
  }
  return res;
};

module.exports = {
  getRandomNumber,
};
