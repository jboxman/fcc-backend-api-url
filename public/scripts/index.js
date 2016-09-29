$(function() {
  $('#short-btn').click(function() {
    $.ajax({
      type: 'post',
      url: '/api/save',
      data: JSON.stringify({
        url: $('#url').val()
      }),
      contentType: 'application/json',
      dataType: 'json',
      success: function(payload) {
        $('#shorturl').val(payload.shortUrl);
      },
      // Bad news
      failure: function() {}
    });
  });
});
