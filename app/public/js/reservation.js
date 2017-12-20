(cleanObj => {
  const user_id = cleanObj.getId();
  $('#viewAllId').click(() => {
    location.pathname = `/${user_id}/identityOperatePage`;
  });
})(cleanObj);
