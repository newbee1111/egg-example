'use strict';

$(function () {
  pushHistory();
  var bool = false;
  setTimeout(function () {
    bool = true;
  }, 1500);
  window.addEventListener('popstate', function (e) {
    if (bool) {
      alert('我监听到了浏览器的返回按钮事件啦'); // 根据自己的需求实现自己的功能
      location.href = '你要跳转的链接';
    }
    pushHistory();
  }, false);
});
function pushHistory() {
  var state = {
    title: 'title',
    url: '#'
  };
  window.history.pushState(state, 'title', '#');
}