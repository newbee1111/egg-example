(cleanObj => {
  const user_id = cleanObj.getId();
  const { mainIdentity } = cleanObj;
  const getSubMes = () => {
    const identity_cards = $("input[name='subIdentityCard']");
    const full_names = $("input[name='subFullName']");
    const identity_card_types = $("input[name='subType']");
    const len = identity_cards.length;
    const result = [];
    for (let i = 0; i < len; i++) {
      const tempObj = {};
      tempObj.identityCard = identity_cards[i].value;
      tempObj.idType = identity_card_types[i].value;
      tempObj.fullName = full_names[i].value;
      result.push(tempObj);
    }
    return result;
  };
  $('#changeMainIdentity').click(() => {
    const identityCard = $('#mainIdentity').val();
    const fullName = $('#fullName').val();
    const idType = $('#idType').val();
    const oldIdentity = mainIdentity.id;
    $.ajax({
      url: `/${user_id}/changeMainIdentity`,
      type: 'post',
      dataType: 'json',
      data: { identityCard, fullName, idType, oldIdentity },
      success(mes) {
        const { identity } = mes;
        $('#mainIdentityShow').html(identity.identity_card);
        $('#mainTypeShow').html(identity.identity_card_type);
        $('#mainFullNameShow').html(identity.full_name);
      },
    });
  });
  $('#bindSubIdentities').click(function() {
    const subIdentities = getSubMes();
    $.ajax({
      type: 'post',
      dataType: 'json',
      data: { subIdentities },
      url: `/${user_id}/bindSubIdentities`,
      success(mes) {
        const wrapper = $('#subIdentityGroup');
        mes.forEach(item => {
          const sub = item.subIdentity;
          wrapper.append(`
          <div class="subId" id="${sub.id}">
            <span>身份证为：</span> 
            <span>${sub.identity_card}</span> 
            <span>证件姓名为：</span> 
            <span>${sub.full_name}</span> 
            <span>证件种类为：</span> 
            <span>${sub.identity_card_type}</span>
            <button type="button" del="${
  sub.id
  }" class="delBtn">删除此同行者</button>
          </div>`);
        });
        delBtnEvent();
      },
    });
  });
  const delBtnEvent = function() {
    $('.delBtn').unbind('click');
    $('.delBtn').click(function() {
      const identity_id = $(this).attr('del');
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
  };
  delBtnEvent();
})(cleanObj);
