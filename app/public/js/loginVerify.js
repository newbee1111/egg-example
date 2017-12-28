(() => {
  const token = localStorage.getItem('token');
  if (token) {
    $.ajax({
      url: '/token',
      type: 'post',
      dataType: 'json',
      data: { token },
      success(mes) {
        if (!mes.success) {
          alert('登录时效已过，请重新获取验证码登录');
          localStorage.removeItem('token');
          location.reload();
        } else if (!mes.bind) {
          location.pathname = `/${mes.user.id}/bindMainPage`;
        } else {
          location.pathname = `/${mes.user.id}/reservationPage`;
        }
      },
    });
  } else {
    $('#getMes').click(function() {
      const tel = $('#telephone').val();
      if (!tel) {
        alert('please input your phone');
        return;
      }
      $.ajax({
        type: 'post',
        url: '/getMes',
        data: { tel },
        dataType: 'json',
        success(mes) {
          const tel = $('#telephone');
          const validateCode = $('#validateCode');
          const submitBtn = $('#submit');
          loginVerify(tel, validateCode, submitBtn, mes);
        },
      });
    });
  }
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
            } else if (!mes.bind) {
              localStorage.setItem('token', mes.token);
              location.pathname = `/${mes.user.id}/bindMainPage`;
            } else {
              localStorage.setItem('token', mes.token);
              location.pathname = `/${mes.user.id}/reservationPage`;
            }
          },
        });
      }
    });
  }
})();
