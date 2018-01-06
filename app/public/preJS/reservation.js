(cleanObj => {
  const user_id = cleanObj.getId();
  cleanObj.setBodyHeight();
  // 日历设置
  moment.locale('cn');
  const clndrTemplate = doT.template($('#dot-template').html());
  $('.calendar-wrapper').clndr({
    clickEvents: {
      click(target) {
        const { element } = target;
        if (element) {
          const span = element.getElementsByTagName('span')[0];
          if (!/clndr-selected/.test(span.className)) {
            $('.clndr-selected').removeClass('clndr-selected');
            span.className += 'clndr-selected ';
          } else {
            span.className = '';
            $('.time').removeClass('time-selected');
            $('#saveClndr').removeClass('validate-selected');
          }
        }
      },
    },
    render(data) {
      return clndrTemplate(data);
    },
    moment,
  });
  // 日历下方选择时间
  $('.time').on('click', e => {
    if (!$('.day span').hasClass('clndr-selected')) {
      alert('请先选择日期');
      return;
    }
    const evt = e || window.event;
    const target = evt.target || evt.srcElement;
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
  $('#cancel').click(() => {
    $('.calendar-whole-wrapper').hide();
    $('.calendar-selector-wrapper').show();
  });
  $('#saveClndr').click(e => {
    const evt = e || window.event;
    const target = evt.target || evet.srcElement;
    if (!$(target).hasClass('validate-selected')) {
      alert('请完整选择预约时间');
      return;
    }
    const classNames = $('.clndr-selected')
      .parent()
      .attr('class');
    const preDate = classNames.split(' ')[1];
    const date = preDate.split('y-')[1];
    const preTime = $('.time-selected').html();
    const time = preTime.split('&nbsp;')[1]; // 注意这里的截断可能有问题
    console.log(`${date} ${time}`);
    $('.calendar-whole-wrapper').hide();
    $('.calendar-selector').val(`${date} ${time}`);
    $('.calendar-selector-wrapper').show();
  });
  // 日历呼出
  $('.clndr-trigger').click(() => {
    $('.calendar-whole-wrapper').show();
    $('.calendar-selector-wrapper').hide();
  });
  // 日历设置结束
  $('#viewAllId').click(() => {
    location.pathname = `/${user_id}/identityOperatePage`;
  });
  let reservers = [];
  let reservation_time_id;
  $("input[type='checkbox']").click(e => {
    const evt = e || window.event;
    const target = evt.target || evt.srcElement;
    const checked = $(target).attr('checked');
    const identity_id = $(target)
      .parent()
      .attr('id');
    if (checked) {
      reservers.push(identity_id);
    } else {
      const temp = [];
      reservers.forEach(item => {
        if (item !== identity_id) {
          temp.push(item);
        }
      });
      reservers = temp;
    }
  });
  $('#timeSelection').change(e => {
    const evt = e || window.event;
    const target = evt.target || evt.srcElement;
    if (target.value !== '0') {
      reservation_time_id = target.value;
    } else {
      reservation_time_id = '';
    }
  });

  $('#reserve').click(() => {
    if (!reservers.length || !reservation_time_id) {
      console.log('您未选择预约时间或者预约人');
      return;
    }
    console.log({ reservers, timeId: reservation_time_id });
    $.ajax({
      type: 'post',
      url: `/${user_id}/reservation`,
      dataType: 'json',
      data: { reservers, timeId: reservation_time_id },
      success(mes) {
        console.log(mes);
      },
    });
  });

  $('#myReservation').on('click', () => {
    location.pathname = `/${user_id}/myReservationPage`;
  });
})(cleanObj);
