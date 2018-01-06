(cleanObj => {
  const getId = cleanObj.getId;
  const user_id = getId();
  cleanObj.setBodyHeight();
  const btn = $('#bindMainIdentity');
  btn.click(function() {
    const mainId = $('#mainIdentity').val();
    const idType = $('#idType li[selected]').attr('value');
    const fullName = $('#fullName').val();
    $.ajax({
      type: 'post',
      url: `/${user_id}/bindMainAct`,
      dataType: 'json',
      data: { mainId, fullName, idType },
      success(mes) {
        if (mes.success) {
          console.log('绑定成功');
          location.pathname = `/${user_id}/reservationPage`;
        } else {
          console.log('身份证已被绑定');
        }
      },
    });
  });

  // 下拉菜单
  $('.dropdown div').click(() => {
    $('.dropdownMenu').toggle();
  });
  $('.dropdownMenu').click(e => {
    const evt = e || window.event;
    const target = evt.target || evt.srcElement;
    $(target)
      .siblings('li')
      .removeAttr('selected');
    $(target).attr('selected', true);
    $('.dropdownMenu').toggle();
    $('.typeViewer').html(target.innerHTML);
  });
})(cleanObj);
