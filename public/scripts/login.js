$('form').submit(function(event) {

  event.preventDefault();

  if ($(this).hasClass('shake')) {
    return;
  }

  $.post(document.URL, $(this).serialize(), function(response) {
    location.reload();
  }).error(function() {

    var timeout,
        form = $(this);

    clearTimeout(timeout);

    form.find('input').addClass('wrong');
    form.addClass('shake');

    timeout = setTimeout(function() {
      form.removeClass('shake');
    }, 1000);

  }.bind(this));

});

$('input').keyup(function(event) {
  var code = event.which;

  if (event.which == 13 || event.which == 9) {
    return;
  }

  $(this).removeClass('wrong');
});
