'use strict';

(function (cleanObj) {
  var user_id = cleanObj.getId();
  $('#viewAllId').click(function () {
    location.pathname = '/' + user_id + '/identityOperatePage';
  });
  var reservers = [];
  var reservation_time_id = void 0;
  $("input[type='checkbox']").click(function (e) {
    var evt = e || window.event;
    var target = evt.target || evt.srcElement;
    var checked = $(target).attr('checked');
    var identity_id = $(target).parent().attr('id');
    if (checked) {
      reservers.push(identity_id);
    } else {
      var temp = [];
      reservers.forEach(function (item) {
        if (item !== identity_id) {
          temp.push(item);
        }
      });
      reservers = temp;
    }
  });
  $('#timeSelection').change(function (e) {
    var evt = e || window.event;
    var target = evt.target || evt.srcElement;
    if (target.value !== '0') {
      reservation_time_id = target.value;
    } else {
      reservation_time_id = '';
    }
  });

  $('#reserve').click(function () {
    if (!reservers.length || !reservation_time_id) {
      console.log('您未选择预约时间或者预约人');
      return;
    }
    console.log({ reservers: reservers, timeId: reservation_time_id });
    $.ajax({
      type: 'post',
      url: '/' + user_id + '/reservation',
      dataType: 'json',
      data: { reservers: reservers, timeId: reservation_time_id },
      success: function success(mes) {
        console.log(mes);
      }
    });
  });

  $('#myReservation').on('click', function () {
    location.pathname = '/' + user_id + '/myReservationPage';
  });
})(cleanObj);