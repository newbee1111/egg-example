const { Service } = require('egg');
const { SMSFunction } = require('../utils/sms');

class SmsService extends Service {
  sendMessage(tel) {
    const validateCode = SMSFunction(tel);
    return validateCode;
  }
}

module.exports = SmsService;
