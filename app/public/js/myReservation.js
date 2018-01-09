'use strict';

(function (cleanObj) {
  var user_id = cleanObj.getId();
  cleanObj.setBodyHeight();
  $('#cancelBtn').on('click', function (e) {
    var evt = e || window.event;
    var target = evt.target || evt.srcElement;
    var reservation_id = $(target).parent().parent().attr('id');

    $.ajax({
      type: 'post',
      url: '/' + user_id + '/cancelReservation',
      dataType: 'json',
      data: { reservation_id: reservation_id },
      success: function success(mes) {
        if (mes.success) {
          $(target).parent().append('<span>已取消</span>');
          $(target).remove();
        }
      }
    });
  });
})(cleanObj);