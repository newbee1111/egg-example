(function(cleanObj) {
  var user_id = cleanObj.getId();
  var { mainIdentity } = cleanObj;
  var getSubMes = () => {
    var identity_cards = $("input[name='subIdentityCard']");
    var full_names = $("input[name='subFullName']");
    var identity_card_types = $("input[name='subType']");
    var len = identity_cards.length;
    var result = [];
    for (var i = 0; i < len; i++) {
      var tempObj = {};
      tempObj.identityCard = identity_cards[i].value;
      tempObj.idType = identity_card_types[i].value;
      tempObj.fullName = full_names[i].value;
      result.push(tempObj);
    }
    return result;
  };
  $('#changeMainIdentity').click(() => {
    var identityCard = $('#mainIdentity').val();
    var fullName = $('#fullName').val();
    var idType = $('#idType').val();
    var oldIdentity = mainIdentity.id;
    $.ajax({
      url: `/${user_id}/changeMainIdentity`,
      type: 'post',
      dataType: 'json',
      data: { identityCard, fullName, idType, oldIdentity },
      success: function(mes) {
        console.log(mes);
        if (mes.success) {
          var { identity } = mes;
          $('#mainIdentityShow').html(identity.identity_card);
          $('#mainTypeShow').html(identity.identity_card_type);
          $('#mainFullNameShow').html(identity.full_name);
        } else {
          alert('身份证已经被绑定过');
        }
      },
    });
  });
  $('#bindSubIdentities').click(function() {
    var subIdentities = getSubMes();
    $.ajax({
      type: 'post',
      dataType: 'json',
      data: { subIdentities },
      url: `/${user_id}/bindSubIdentities`,
      success: function(mes) {
        var wrapper = $('#subIdentityGroup');
        mes.forEach(function(item) {
          var sub = item.subIdentity;
          if (item.success) {
            wrapper.append('<div class="subId" id="'+sub.id+'}">'+
              '<span>身份证为：</span>'+ 
              '<span>'+sub.identity_card+'</span>'+
              '<span>证件姓名为：</span>' +
              '<span>'+sub.full_name+'</span>' +
              '<span>证件种类为：</span>' +
              '<span>'+sub.identity_card_type+'</span>'+
              '<button type="button" del="'+sub.id+
              '" class="delBtn">删除此同行者</button>'+
              '</div>');
          }
        });
        if (!mes.every(function(item){ return item.success })) {
          alert('所填的某些身份证已经绑定到您的账号上了，请勿重复绑定');
        }
        delBtnEvent();
      },
    });
  });
  var delBtnEvent = function() {
    $('.delBtn').unbind('click');
    $('.delBtn').click(function() {
      var identity_id = $(this).attr('del');
      $.ajax({
        type: 'post',
        url: `/${user_id}/delSubIdentity`,
        dataType: 'json',
        data: { identity_id: identity_id },
        success: function(mes) {
          if (mes.success) {
            $(`#${identity_id}`).remove();
          }
        },
      });
    });
  };
  delBtnEvent();
  $('#goReservation').click(() => {
    location.pathname = `/${user_id}/reservationPage`;
  });
})(cleanObj);
