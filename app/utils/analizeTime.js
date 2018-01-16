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

module.exports = { analizeTime };
