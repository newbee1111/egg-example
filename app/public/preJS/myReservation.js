(cleanObj => {
  const user_id = cleanObj.getId();
  cleanObj.setBodyHeight();
  $('#cancelBtn').on('click', e => {
    const evt = e || window.event;
    const target = evt.target || evt.srcElement;
    const reservation_id = $(target)
      .parent()
      .parent()
      .attr('id');
    $.ajax({
      type: 'post',
      url: `/${user_id}/cancelReservation`,
      dataType: 'json',
      data: { reservation_id },
      success(mes) {
        if (mes.success) {
          $(target)
            .parent()
            .append('<span>已取消</span>');
          $(target).remove();
        }
      },
    });
  });
})(cleanObj);
