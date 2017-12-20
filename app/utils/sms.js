const SMSClient = require('@alicloud/sms-sdk');
const { getRandomNumber } = require('../utils/random');
// ACCESS_KEY_ID/ACCESS_KEY_SECRET 根据实际申请的账号信息进行替换
const accessKeyId = 'Your accessKeyId';
const secretAccessKey = 'Your secretAccessKey';
// 初始化sms_client
const smsClient = new SMSClient({ accessKeyId, secretAccessKey });
const SMSFunction = tel => {
  const validateCode = getRandomNumber();
  smsClient
    .sendSMS({
      PhoneNumbers: tel, // 电话
      SignName: '贝壳访客', // 阿里云上设定的签名
      TemplateCode: 'SMS_115760126', // 短信内容模板
      TemplateParam: `{code: ${validateCode}}`, // 验证码
    })
    .then(
      function(res) {
        const { Code } = res;
        if (Code === 'OK') {
          // 处理返回参数
          console.log(res);
        }
      },
      function(err) {
        console.log(err);
      }
    );

  return validateCode;
};

module.exports = { SMSFunction };
