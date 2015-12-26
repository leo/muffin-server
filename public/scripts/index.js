const form = document.querySelector('form');

form.addEventListener('submit', function(event) {

  var timeout;

  if (this.classList.contains('shake')) {
    return;
  }

  const request = new XMLHttpRequest();
  const fields = new FormData(form);

  request.onreadystatechange = function() {

    if (request.status == 401) {

      clearTimeout(timeout);

      if (form.classList.contains('error')) {
        form.classList.add('shake');
      } else {
        form.classList.add('shake error');
      }

      timeout = setTimeout(function() {
        form.classList.remove('shake');
      }, 1000);

    } else {
      location.reload();
    }

  }

  request.open(this.method, '/api/login', true);
  request.send(fields);

  event.preventDefault();

});
