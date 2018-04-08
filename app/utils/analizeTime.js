const analizeTime = date => {
  let tempDate = date;
  if (!date instanceof Date) {
    tempDate = new Date(date);
  }
  const year = tempDate.getFullYear();
  let month = tempDate.getMonth();
  let day = tempDate.getDate();
  let min = tempDate.getMinutes();
  let hour = tempDate.getHours();
  let second = tempDate.getSeconds();
  month = month + 1;
  if (month < 10) month = `0${month}`;
  if (day < 10) day = `0${day}`;
  if (min < 10) min = `0${min}`;
  if (hour < 10) hour = `0${hour}`;
  if (second < 10) second = `0${second}`;
  return { year, month, day, hour, min, second };
};

const reformTime = timeObj => {
  const year = timeObj.year || 2018;
  const month = timeObj.month || 1;
  const day = timeObj.day || 1;
  const hour = timeObj.hour || 0;
  const min = timeObj.min || 0;
  const second = timeObj.second || 0;

  return new Date(year, month, day, hour, min, second, 0);
};

module.exports = { analizeTime, reformTime };
