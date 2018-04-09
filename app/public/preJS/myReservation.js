(cleanObj => {
  const user_id = cleanObj.getId();
  cleanObj.setBodyHeight();
  $(document).on('click', '.cancel-wrapper', e => {
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
          if (target.tagName === 'DIV') {
            $(target)
              .parent()
              .remove();
          } else {
            $(target)
              .parent()
              .parent()
              .remove();
          }
          const currentList = $('.current-list');
          if (!currentList.length) {
            const emptyEle = $(
              '<div class="empty-wrapper">' +
								'<span>暂无预约记录...</span>' +
								'</div>'
            );
            emptyEle.insertAfter('.current-title');
          }
        } else {
          alert(mes.message);
        }
      },
    });
  });
})(cleanObj);
