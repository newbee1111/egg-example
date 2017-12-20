const cleanObj = (() => {
  const getId = function() {
    const pathname = location.pathname;
    const id = pathname.split('/')[1];
    return id;
  };
  const cleanSession = function() {
    $.ajax({
      type: 'post',
      url: `/${getId()}/cleanSession`,
      dataType: 'json',
      success(mes) {
        console.log(mes);
      },
    });
  };
  const body = window.document.body;
  // 此处为pc浏览器的关闭测试，
  // 对于微信浏览器，往往用户使用的较多的是返回公众号的操作，
  // 对应的监听代码请看 public/js/wechatGoBack.js
  // window.onunload = function() {
  //   cleanSession();
  // };
  return {
    cleanSession,
    getId,
  };
})();
