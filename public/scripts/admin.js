function $(selector) {

  const amount = document.querySelectorAll(selector).length;

  if (amount <= 0) {
    return document.createElement('aside');
  }

  switch (amount) {
    case 1:
      return document.querySelector(selector);
      break;
    default:
      return document.querySelectorAll(selector);
  }

}

function queryVariable(name) {

  const query = window.location.search.substring(1),
        vars = query.split('&');

  for (var i = 0; i < vars.length; i++) {
    var pair = vars[i].split('=');
    if (pair[0] == name) {
      return pair[1];
    }
  }

  return(false);

}

const chest = $('#chest'),
      nav = chest.querySelector('nav');

if (chest.tagName != 'ASIDE') {

  chest.querySelector('.toggle').addEventListener('click', function(event) {

    nav.classList.toggle('open');
    this.classList.toggle('on');

    event.preventDefault();

  });

}
