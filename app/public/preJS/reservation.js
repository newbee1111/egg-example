(cleanObj => {
  const user_id = cleanObj.getId();
  cleanObj.setBodyHeight();
  // 日历设置
  moment.locale('cn');
  // 后台返回可预约日历日期分析函数
  const clndrDate = reservationTime => {
    const now = new Date();
    reservationTime.forEach(item => {
      const { avail_time, date, time_start, time_end, id } = item;
      if (
        now.getTime() > new Date(avail_time).getTime() &&
				now.getTime() < new Date(date).getTime()
      ) {
        $(`.calendar-day-${date}`).removeClass('invalid');
        $(`.calendar-day-${date}`).click(e => {
          const evt = e || window.event;
          const target = evt.target || evt.srcElement;
          if (
            (target.tagName === 'TD' &&
							!$(target)
							  .find('span')
							  .hasClass('clndr-selected')) ||
						(target.tagName === 'SPAN' && !$(target).hasClass('clndr-selected'))
          ) {
            $('.time-wrapper').append(
              `<span class="time" id="${id}">${time_start} ~ ${time_end}</span>`
            );
            $('.day-time').show();
          } else {
            $('.time-wrapper').empty();
            $('.day-time').hide();
          }
        });
      }
    });
  };
  const clndrTemplate = doT.template($('#dot-template').html());
  $('.calendar-wrapper').clndr({
    clickEvents: {
      click(target) {
        const { element } = target;
        if (element) {
          if (
            /past/.test(element.className) ||
						/invalid/.test(element.className)
          ) {
            return;
          }
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
  $(document).on('click', '.time', e => {
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
    const time = preTime; // 注意这里的截断可能有问题
    $('.calendar-whole-wrapper').hide();
    $('.calendar-selector').val(`${date} ${time}`);
    $('.calendar-selector-wrapper').show();
  });
  // 日历呼出与隐藏
  $('.clndr-trigger').click(() => {
    $('.calendar-whole-wrapper').show();
    $('.calendar-selector-wrapper').hide();
  });

  // 日历根据后台传输的reservationTime来改动日历
  const { reservationTime } = cleanObj;
  clndrDate(reservationTime);
  // 日历设置结束

  // 添加游客的填写框
  $('.add-wrapper').click(() => {
    $('.add-wrapper').toggle();
    $('.add-form-wrapper').toggle();
  });
  $('.identity-type').click(e => {
    const evt = e || window.event;
    const target = evt.target || evt.srcElement;
    if ($(target).hasClass('identity-type-selected')) {
      $(target).removeClass('identity-type-selected');
      $('#saveAdd').removeClass('can-save');
    } else {
      $(target)
        .siblings()
        .removeClass('identity-type-selected');
      $(target).addClass('identity-type-selected');
      if ($('#subFullName').val() && $('#subIdentity').val()) {
        $('#saveAdd').addClass('can-save');
      }
    }
  });
  // 添加游客检验 保存按钮输入完整时应该有样式提示
  $('#subIdentity')[0].addEventListener('input', e => {
    if (!$('#subFullName').val() || !$('.identity-type-selected')[0]) {
      return;
    }
    const evt = e || window.event;
    const target = evt.target || evt.srcElement;
    if (!$(target).val()) {
      $('#saveAdd').removeClass('can-save');
      return;
    }
    $('#saveAdd').addClass('can-save');
  });
  $('#subFullName')[0].addEventListener('input', e => {
    if (!$('#subIdentity').val() || !$('.identity-type-selected')[0]) {
      return;
    }
    const evt = e || window.event;
    const target = evt.target || evt.srcElement;
    if (!$(target).val()) {
      $('#saveAdd').removeClass('can-save');
      return;
    }
    $('#saveAdd').addClass('can-save');
  });
  $('#cancelAdd').click(() => {
    $('.add-wrapper').toggle();
    $('.add-form-wrapper').toggle();
  });
  // 添加游客的填写框结束
  const getSubMes = () => {
    const identityCard = $('#subIdentity').val();
    const idType = $('.identity-type-selected').attr('value');
    const fullName = $('#subFullName').val();
    return [{ identityCard, idType, fullName }];
  };
  const clearForm = () => {
    $('#subIdentity').val('');
    $('.identity-type-selected').removeClass('identity-type-selected');
    $('.identity-type:first-child').addClass('identity-type-selected');
    $('#subFullName').val('');
  };
  // 添加游客的ajax
  $('#saveAdd').click(function() {
    if (!$('#saveAdd').hasClass('can-save')) {
      alert('请完整填写信息');
      return;
    }
    const subIdentities = getSubMes();
    $.ajax({
      type: 'post',
      dataType: 'json',
      data: { subIdentities },
      url: `/${user_id}/bindSubIdentities`,
      success(mes) {
        const wrapper = $('#subIdentities');
        const item = mes[0];
        if (item.success) {
          wrapper.prepend(`
          <div class="identity" id="${item.subIdentity.id}">
            <i class="material-icons float-left">person copy</i>
            <div class="identity-wrapper">
              <div class="identity-full-name">
                ${item.subIdentity.full_name}
              </div>
              <div class="identity-number">
                ${item.subIdentity.identity_card}
              </div>
            </div>
            <i class="material-icons float-right cancelReservation">cancel_copy</i>
          </div>
        `);
          $('.add-wrapper').toggle();
          $('.add-form-wrapper').toggle();
          clearForm();
        } else {
          alert('该证件号已经被绑定在您账号上了');
        }
      },
    });
  });
  // 将游客从预约列表中去除，但并没有删除与用户的绑定关系
  $(document).on('click', '.cancelReservation', e => {
    if (!confirm('确定将他(她)从本次预约中去除吗？')) return;
    const evt = e || window.event;
    const target = evt.target || evt.srcElement;
    $(target)
      .parent()
      .remove();
  });

  // 预约
  $('#reservation').on('click', e => {
    const reservers = [];
    const identities = $('.identity');
    const len = identities.length;
    for (let i = 0; i < len; i++) {
      reservers.push(identities[i].id);
    }
    const timeId = $('.time-selected').attr('id');
    if (!reservers.length || !timeId) {
      alert('预约信息不完整！');
      return;
    }

    $.ajax({
      type: 'post',
      dataType: 'json',
      data: { reservers, timeId },
      url: `/${user_id}/reservation`,
      success(mes) {
        if (mes.success) {
          alert('预约成功，请前往公众号我的预约中查看');
        }
      },
    });
  });
})(cleanObj);
