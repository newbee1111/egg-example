(function(cleanObj) {
  const user_id = cleanObj.getId();
  const { mainIdentity } = cleanObj;
  cleanObj.setBodyHeight();
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
  // $('#changeMainIdentity').click(() => {
  //   const identityCard = $('#mainIdentity').val();
  //   const fullName = $('#fullName').val();
  //   const idType = $('#idType').val();
  //   const oldIdentity = mainIdentity.id;
  //   $.ajax({
  //     url: `/${user_id}/changeMainIdentity`,
  //     type: 'post',
  //     dataType: 'json',
  //     data: { identityCard, fullName, idType, oldIdentity },
  //     success(mes) {
  //       console.log(mes);
  //       if (mes.success) {
  //         const { identity } = mes;
  //         $('#mainIdentityShow').html(identity.identity_card);
  //         $('#mainTypeShow').html(identity.identity_card_type);
  //         $('#mainFullNameShow').html(identity.full_name);
  //       } else {
  //         alert('身份证已经被绑定过');
  //       }
  //     },
  //   });
  // });
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
  // 删除该从身份证，此处为真的从数据库中去除绑定关系
  $(document).on('click', '.cancelReservation', e => {
    if (!confirm('确定将他(她)删除吗？')) return;
    const evt = e || window.event;
    const target = evt.target || evt.srcElement;
    const identity_id = $(target)
      .parent()
      .attr('id');
    $.ajax({
      type: 'post',
      url: `/${user_id}/delSubIdentity`,
      dataType: 'json',
      data: { identity_id },
      success(mes) {
        if (mes.success) {
          $(`#${identity_id}`).remove();
        }
      },
    });
  });
  // var delBtnEvent = function() {
  //   $('.delBtn').unbind('click');
  //   $('.delBtn').click(function() {
  //     const identity_id = $(this).attr('del');
  //     $.ajax({
  //       type: 'post',
  //       url: `/${user_id}/delSubIdentity`,
  //       dataType: 'json',
  //       data: { identity_id },
  //       success(mes) {
  //         if (mes.success) {
  //           $(`#${identity_id}`).remove();
  //         }
  //       },
  //     });
  //   });
  // };
  // delBtnEvent();
  // $('#goReservation').click(() => {
  //   location.pathname = `/${user_id}/reservationPage`;
  // });
})(cleanObj);
