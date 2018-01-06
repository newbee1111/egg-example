'use strict';

(function (cleanObj) {
  var user_id = cleanObj.getId();
  cleanObj.setBodyHeight();
  // 日历设置
  moment.locale('cn');
  var clndrTemplate = doT.template($('#dot-template').html());
  $('.calendar-wrapper').clndr({
    clickEvents: {
      click: function click(target) {
        var element = target.element;

        if (element) {
          var span = element.getElementsByTagName('span')[0];
          if (!/clndr-selected/.test(span.className)) {
            $('.clndr-selected').removeClass('clndr-selected');
            span.className += 'clndr-selected ';
          } else {
            span.className = '';
            $('.time').removeClass('time-selected');
            $('#saveClndr').removeClass('validate-selected');
          }
        }
      }
    },
    render: function render(data) {
      return clndrTemplate(data);
    },

    moment: moment
  });
  // 日历下方选择时间
  $('.time').on('click', function (e) {
    if (!$('.day span').hasClass('clndr-selected')) {
      alert('请先选择日期');
      return;
    }
    var evt = e || window.event;
    var target = evt.target || evt.srcElement;
    if (!$(target).hasClass('time-selected')) {
      $('.time').removeClass('time-selected');
      $(target).addClass('time-selected');
      $('#saveClndr').addClass('validate-selected');
    } else {
      $(target).removeClass('time-selected');
      $('#saveClndr').removeClass('validate-selected');
    }
  });
  // 日历保存与取消操作
  $('#cancel').click(function () {
    $('.calendar-whole-wrapper').hide();
    $('.calendar-selector-wrapper').show();
  });
  $('#saveClndr').click(function (e) {
    var evt = e || window.event;
    var target = evt.target || evet.srcElement;
    if (!$(target).hasClass('validate-selected')) {
      alert('请完整选择预约时间');
      return;
    }
    var classNames = $('.clndr-selected').parent().attr('class');
    var preDate = classNames.split(' ')[1];
    var date = preDate.split('y-')[1];
    var preTime = $('.time-selected').html();
    var time = preTime.split('&nbsp;')[1]; // 注意这里的截断可能有问题
    console.log(date + ' ' + time);
    $('.calendar-whole-wrapper').hide();
    $('.calendar-selector').val(date + ' ' + time);
    $('.calendar-selector-wrapper').show();
  });
  // 日历呼出
  $('.clndr-trigger').click(function () {
    $('.calendar-whole-wrapper').show();
    $('.calendar-selector-wrapper').hide();
  });
  // 日历设置结束
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