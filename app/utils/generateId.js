const generateId = () => {
  const autoId = parseInt(Math.random() * 10e6 + 1);
  const autoCharacter = [
    '1',
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9',
    'A',
    'B',
    'C',
    'D',
    'E',
  ];

  const len = 7 - parseInt(Math.log(autoId) / Math.log(10) + 1);
  let numberId =
		String(parseInt(Math.random() + 1)) + parseInt(Math.random() * 3 + 1);
  for (let i = 1; i <= len - 1; i++) {
    numberId += autoCharacter[parseInt(Math.random() * 13 + 1)];
  }
  const numberStr = numberId + 'E' + autoId;
  const result = parseInt(numberStr, 16);
  return result;
};

module.exports = { generateId };
