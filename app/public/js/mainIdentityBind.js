'use strict';

(function (cleanObj) {
  var getId = cleanObj.getId;
  var user_id = getId();
  cleanObj.setBodyHeight();
  var btn = $('#bindMainIdentity');
  btn.click(function () {
    var mainId = $('#mainIdentity').val();
    var idType = $('#idType li[selected]').attr('value');
    var fullName = $('#fullName').val();
    $.ajax({
      type: 'post',
      url: '/' + user_id + '/bindMainAct',
      dataType: 'json',
      data: { mainId: mainId, fullName: fullName, idType: idType },
      success: function success(mes) {
        if (mes.success) {
          console.log('绑定成功');
          location.pathname = '/' + user_id + '/reservationPage';
        } else {
          console.log('身份证已被绑定');
        }
      }
    });
  });

  // 下拉菜单
  $('.dropdown div').click(function () {
    $('.dropdownMenu').toggle();
  });
  $('.dropdownMenu').click(function (e) {
    var evt = e || window.event;
    var target = evt.target || evt.srcElement;
    $(target).siblings('li').removeAttr('selected');
    $(target).attr('selected', true);
    $('.dropdownMenu').toggle();
    $('.typeViewer').html(target.innerHTML);
  });
})(cleanObj);