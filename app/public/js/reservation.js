'use strict';

(function (cleanObj) {
  var user_id = cleanObj.getId();
  cleanObj.setBodyHeight();
  // 日历设置
  moment.locale('cn');
  // 后台返回可预约日历日期分析函数
  var clndrDate = function clndrDate(reservationTime) {
    var now = new Date();
    reservationTime.forEach(function (item) {
      var avail_time = item.avail_time,
          date = item.date,
          time_start = item.time_start,
          time_end = item.time_end,
          id = item.id;

      if (now.getTime() > new Date(avail_time).getTime() && now.getTime() < new Date(date).getTime()) {
        $('.calendar-day-' + date).removeClass('invalid');
        $('.calendar-day-' + date).click(function (e) {
          var evt = e || window.event;
          var target = evt.target || evt.srcElement;
          if (target.tagName === 'TD' && !$(target).find('span').hasClass('clndr-selected') || target.tagName === 'SPAN' && !$(target).hasClass('clndr-selected')) {
            $('.time-wrapper').append('<span class="time" id="' + id + '">' + time_start + ' ~ ' + time_end + '</span>');
            $('.day-time').show();
          } else {
            $('.time-wrapper').empty();
            $('.day-time').hide();
          }
        });
      }
    });
  };
  var clndrTemplate = doT.template($('#dot-template').html());
  $('.calendar-wrapper').clndr({
    clickEvents: {
      click: function click(target) {
        var element = target.element;

        if (element) {
          if (/past/.test(element.className) || /invalid/.test(element.className)) {
            return;
          }
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
  $(document).on('click', '.time', function (e) {
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
    var time = preTime; // 注意这里的截断可能有问题
    console.log(date + ' ' + time);
    $('.calendar-whole-wrapper').hide();
    $('.calendar-selector').val(date + ' ' + time);
    $('.calendar-selector-wrapper').show();
  });
  // 日历呼出与隐藏
  $('.clndr-trigger').click(function () {
    $('.calendar-whole-wrapper').show();
    $('.calendar-selector-wrapper').hide();
  });

  // 日历根据后台传输的reservationTime来改动日历
  console.log(cleanObj.reservationTime);
  var reservationTime = cleanObj.reservationTime;

  clndrDate(reservationTime);
  // 日历设置结束

  // 添加游客的填写框
  $('.add-wrapper').click(function () {
    $('.add-wrapper').toggle();
    $('.add-form-wrapper').toggle();
  });
  $('.identity-type').click(function (e) {
    var evt = e || window.event;
    var target = evt.target || evt.srcElement;
    if ($(target).hasClass('identity-type-selected')) {
      $(target).removeClass('identity-type-selected');
      $('#saveAdd').removeClass('can-save');
    } else {
      $(target).siblings().removeClass('identity-type-selected');
      $(target).addClass('identity-type-selected');
      if ($('#subFullName').val() && $('#subIdentity').val()) {
        $('#saveAdd').addClass('can-save');
      }
    }
  });
  // 添加游客检验 保存按钮输入完整时应该有样式提示
  $('#subIdentity')[0].addEventListener('input', function (e) {
    if (!$('#subFullName').val() || !$('.identity-type-selected')[0]) {
      return;
    }
    var evt = e || window.event;
    var target = evt.target || evt.srcElement;
    if (!$(target).val()) {
      $('#saveAdd').removeClass('can-save');
      return;
    }
    $('#saveAdd').addClass('can-save');
  });
  $('#subFullName')[0].addEventListener('input', function (e) {
    if (!$('#subIdentity').val() || !$('.identity-type-selected')[0]) {
      return;
    }
    var evt = e || window.event;
    var target = evt.target || evt.srcElement;
    if (!$(target).val()) {
      $('#saveAdd').removeClass('can-save');
      return;
    }
    $('#saveAdd').addClass('can-save');
  });
  $('#cancelAdd').click(function () {
    $('.add-wrapper').toggle();
    $('.add-form-wrapper').toggle();
  });
  // 添加游客的填写框结束
  var getSubMes = function getSubMes() {
    var identityCard = $('#subIdentity').val();
    var idType = $('.identity-type-selected').attr('value');
    var fullName = $('#subFullName').val();
    return [{ identityCard: identityCard, idType: idType, fullName: fullName }];
  };
  var clearForm = function clearForm() {
    $('#subIdentity').val('');
    $('.identity-type-selected').removeClass('identity-type-selected');
    $('.identity-type:first-child').addClass('identity-type-selected');
    $('#subFullName').val('');
  };
  // 添加游客的ajax
  $('#saveAdd').click(function () {
    if (!$('#saveAdd').hasClass('can-save')) {
      alert('请完整填写信息');
      return;
    }
    var subIdentities = getSubMes();
    $.ajax({
      type: 'post',
      dataType: 'json',
      data: { subIdentities: subIdentities },
      url: '/' + user_id + '/bindSubIdentities',
      success: function success(mes) {
        var wrapper = $('#subIdentities');
        var item = mes[0];
        if (item.success) {
          wrapper.prepend('\n          <div class="identity" id="' + item.subIdentity.id + '">\n            <i class="material-icons float-left">person copy</i>\n            <div class="identity-wrapper">\n              <div class="identity-full-name">\n                ' + item.subIdentity.full_name + '\n              </div>\n              <div class="identity-number">\n                ' + item.subIdentity.identity_card + '\n              </div>\n            </div>\n            <i class="material-icons float-right cancelReservation">cancel_copy</i>\n          </div>\n        ');
          $('.add-wrapper').toggle();
          $('.add-form-wrapper').toggle();
          clearForm();
        } else {
          alert('该证件号已经被绑定在您账号上了');
        }
      }
    });
  });
  // 将游客从预约列表中去除，但并没有删除与用户的绑定关系
  $(document).on('click', '.cancelReservation', function (e) {
    if (!confirm('确定将他(她)从本次预约中去除吗？')) return;
    var evt = e || window.event;
    var target = evt.target || evt.srcElement;
    $(target).parent().remove();
  });
})(cleanObj);