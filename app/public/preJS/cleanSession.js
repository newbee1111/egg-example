const cleanObj = (function() {
  // 对jquery的ajax请求进行统一头设定
  // const csrftoken = Cookies.get('csrftoken');
  // console.log(csrftoken);
  // function csrfSafeMethod(method) {
  //   // these HTTP methods do not require CSRF protectoion
  //   return /^(GET|HEAD|OPTIONS|TRACE)$/.test(method);
  // }
  // $.ajaxSetup({
  //   beforeSend(xhr, settings) {
  //     if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
  //       xhr.setRequestHeader('x-csrf-token', csrftoken);
  //     }
  //   },
  // });
  const getId = function() {
    const pathname = location.pathname;
    const id = pathname.split('/')[1];
    return id;
  };
  const getCode = function() {
    const href = location.href;
    const url = href.split('?')[1];
    if (!url) return;
    const codeStr = url.split('&')[0];
    if (!codeStr) return;
    const code = codeStr.split('=')[1];
    return code;
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
    getCode,
  };
})();
