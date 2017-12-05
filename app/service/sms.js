const { Service } = require('egg');
const { SMSFunction } = require('../utils/sms');

class SmsService extends Service {
  sendMessage(tel) {
    SMSFunction(tel);
  }
}

module.exports = SmsService;
