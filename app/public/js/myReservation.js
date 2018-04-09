'use strict';

(function (cleanObj) {
  var user_id = cleanObj.getId();
  cleanObj.setBodyHeight();
  $(document).on('click', '.cancel-wrapper', function (e) {
    var evt = e || window.event;
    var target = evt.target || evt.srcElement;
    var reservation_id = target.getAttribute('id');
    $.ajax({
      type: 'post',
      url: '/' + user_id + '/cancelReservation',
      dataType: 'json',
      data: { reservation_id: reservation_id },
      success: function success(mes) {
        if (mes.success) {
          if (target.tagName === 'DIV') {
            $(target).parent().remove();
          } else {
            $(target).parent().parent().remove();
          }
          var currentList = $('.current-list');
          if (!currentList.length) {
            var emptyEle = $('<div class="empty-wrapper">' + '<span>暂无预约记录...</span>' + '</div>');
            emptyEle.insertAfter('.current-title');
          }
        } else {
          alert(mes.message);
        }
      }
    });
  });
})(cleanObj);