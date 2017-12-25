(cleanObj => {
  const user_id = cleanObj.getId();
  $('#viewAllId').click(() => {
    location.pathname = `/${user_id}/identityOperatePage`;
  });
  let reservers = [];
  let reservation_time_id;
  $("input[type='checkbox']").click(e => {
    const evt = e || window.event;
    const target = evt.target || evt.srcElement;
    const checked = $(target).attr('checked');
    const identity_id = $(target)
      .parent()
      .attr('id');
    if (checked) {
      reservers.push(identity_id);
    } else {
      const temp = [];
      reservers.forEach(item => {
        if (item !== identity_id) {
          temp.push(item);
        }
      });
      reservers = temp;
    }
  });
  $('#timeSelection').change(e => {
    const evt = e || window.event;
    const target = evt.target || evt.srcElement;
    if (target.value !== '0') {
      reservation_time_id = target.value;
    } else {
      reservation_time_id = '';
    }
  });

  $('#reserve').click(() => {
    if (!reservers.length || !reservation_time_id) {
      console.log('您未选择预约时间或者预约人');
      return;
    }
    console.log({ reservers, timeId: reservation_time_id });
    $.ajax({
      type: 'post',
      url: `/${user_id}/reservation`,
      dataType: 'json',
      data: { reservers, timeId: reservation_time_id },
      success(mes) {
        console.log(mes);
      },
    });
  });

  $('#myReservation').on('click', () => {
    location.pathname = `/${user_id}/myReservationPage`;
  });
})(cleanObj);
