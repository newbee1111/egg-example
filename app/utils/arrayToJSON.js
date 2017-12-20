// 处理findAll 返回的数组的sequelize对象
const arrayToJSON = (array, removeArray = false) => {
  const result = [];
  array.forEach(item => {
    const itemRes = item.toJSON();
    result.push(itemRes);
  });
  if (removeArray) return result[0];
  return result;
};

module.exports = { arrayToJSON };
