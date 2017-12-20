(cleanObj => {
  const getId = cleanObj.getId;
  const user_id = getId();
  const btn = $('#bindMainIdentity');
  btn.click(function() {
    const mainId = $('#mainIdentity').val();
    const idType = $('#idType').val();
    const fullName = $('#fullName').val();
    $.ajax({
      type: 'post',
      url: `/${user_id}/bindMainAct`,
      dataType: 'json',
      data: { mainId, fullName, idType },
      success(mes) {
        if (mes.success) {
          console.log('绑定成功');
          location.pathname = `/${user_id}/reservation`;
        } else {
          console.log('身份证已被绑定');
        }
      },
    });
  });
})(cleanObj);
