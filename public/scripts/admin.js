(function() {

  if (document.body.classList.contains('login')) {
    return;
  }

  const chest = document.querySelector('#chest'),
        toggler = chest.querySelector('.toggle'),
        nav = chest.querySelector('nav');

  chest.querySelector('.toggle').addEventListener('click', function(event) {

    nav.classList.toggle('open');
    this.classList.toggle('on');

    event.preventDefault();

  });

})();
