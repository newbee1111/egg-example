(cleanObj => {
  const user_id = cleanObj.getId();
  cleanObj.setBodyHeight();
  $(document).on('click', '.cancel-wrapper', e => {
    if (!window.confirm('你确定要取消此预约吗')) return;
    const evt = e || window.event;
    const target = evt.target || evt.srcElement;
    const reservation_id = target.getAttribute('id');
    $.ajax({
      type: 'post',
      url: `/${user_id}/cancelReservation`,
      dataType: 'json',
      data: { reservation_id },
      success(mes) {
        if (mes.success) {
          // if (target.tagName === 'DIV') {
          //   $(target)
          //     .parent()
          //     .remove();
          // } else {
          //   $(target)
          //     .parent()
          //     .parent()
          //     .remove();
          // }
          // const currentList = $('.current-list');
          // if (!currentList.length) {
          //   const emptyEle = $(
          //     '<div class="empty-wrapper">' +
          // 			'<span>暂无预约记录...</span>' +
          // 			'</div>'
          //   );
          //   emptyEle.insertAfter('.current-title');
          // }
          location.reload(true);
        } else {
          alert(mes.message);
        }
      },
    });
  });
  $(document).on('click', '.cancel-icon', e => {
    if (!window.confirm('你确定从此预约中删除此人吗？')) return;
    const evt = e || window.event;
    const target = evt.target || evt.srcElement;
    const reservation_id = target.getAttribute('data-target');
    const reserver_id = target.getAttribute('id');
    $.ajax({
      dataType: 'json',
      type: 'post',
      url: `/${user_id}/removeReservationPerson`,
      data: { reservation_id, reserver_id },
      success(mes) {
        if (mes.success) {
          location.reload(true);
        } else {
          alert(mes.message);
        }
      },
    });
  });
})(cleanObj);
