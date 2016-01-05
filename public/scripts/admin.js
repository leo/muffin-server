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

const chest = $('#chest'),
      nav = chest.querySelector('nav');

if (chest.tagName != 'ASIDE') {

  chest.querySelector('.toggle').addEventListener('click', function(event) {

    nav.classList.toggle('open');
    this.classList.toggle('on');

    event.preventDefault();

  });

}
