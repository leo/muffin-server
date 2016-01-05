const form = $('form'),
      inputs = $('input');

form.addEventListener('submit', function(event) {

  event.preventDefault();

  if (this.classList.contains('shake')) {
    return;
  }

  const httpRequest = new XMLHttpRequest();

  httpRequest.addEventListener('readystatechange', function(data) {

    if (this.readyState !== 4) {
      return;
    }

    const response = JSON.parse(this.responseText);

    if (this.status === 200 && response.success) {

      const query = queryVariable('to'),
            target = query ? '/' + decodeURIComponent(query) : '';

      window.location.replace('/admin' + target);

    } else {

      var timeout;

      clearTimeout(timeout);

      [].forEach.call(inputs, function(input) {
        input.classList.add('wrong');
      });

      form.classList.add('shake');

      timeout = setTimeout(function() {
        form.classList.remove('shake');
      }, 1000);

    }

  });

  const fields = {
    username: this[0].value,
    password: this[1].value
  }

  httpRequest.open('POST', document.URL);
  httpRequest.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
  httpRequest.send(JSON.stringify(fields));

});

function adjustBorder(event) {

  const code = event.which;

  if (event.which == 13 || event.which == 9) {
    return;
  }

  this.classList.remove('wrong');

}

for (var i = 0; i < inputs.length; i++) {
  inputs[i].addEventListener('keyup', adjustBorder);
}
