'use strict';

(function (cleanObj) {
  var user_id = cleanObj.getId();
  var mainIdentity = cleanObj.mainIdentity;

  cleanObj.setBodyHeight();
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
  // 删除该从身份证，此处为真的从数据库中去除绑定关系
  $(document).on('click', '.cancelReservation', function (e) {
    if (!confirm('确定将他(她)删除吗？')) return;
    var evt = e || window.event;
    var target = evt.target || evt.srcElement;
    var identity_id = $(target).parent().attr('id');
    $.ajax({
      type: 'post',
      url: '/' + user_id + '/delSubIdentity',
      dataType: 'json',
      data: { identity_id: identity_id },
      success: function success(mes) {
        if (mes.success) {
          $('#' + identity_id).remove();
        }
      }
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