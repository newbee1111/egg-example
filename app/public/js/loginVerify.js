// submitBtn should be jquery element
function loginVerify(tel, validateCode, submitBtn, verifyObj) {
  submitBtn.unbind('click');
  submitBtn.click(function() {
    let realPhone = verifyObj.tel,
      realCode = verifyObj.validateCode,
      expireTime = verifyObj.expireTime,
      telVal = tel.val(),
      code = validateCode.val();
    if (realPhone === telVal && realCode === code) {
      $.ajax({
        url: '/login',
        dataType: 'json',
        type: 'post',
        data: { tel: telVal, expireTime },
        success(mes) {
          if (!mes.success) {
            alert('验证码已经过期，请重新获取');
          } else {
            console.log(mes);
            localStorage.setItem('token', mes.token);
          }
        },
      });
    }
  });
}
