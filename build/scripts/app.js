import { tryCreditals, adjustBorder } from './login'

const inputs = $('.login input')

$('.login form').submit(tryCreditals)

for (var i = 0; i < inputs.length; i++) {
  inputs[i].addEventListener('keyup', adjustBorder)
}

const chest = $('#chest')
const nav = chest.find('nav')

chest.find('.toggle').click(function (event) {
  nav.toggleClass('open')
  $(this).toggleClass('on')

  event.preventDefault()
})

const drop = $('body.media').dropzone({
  clickable: '#title .add',
  url: '/admin/media/upload',
  previewsContainer: '#files',
  previewTemplate: $('#preview-template').html(),
  thumbnailWidth: 360,
  thumbnailHeight: 360
})

drop.on('dragenter', function () {
  $('#drop-zone').show()
})

drop.on('drop', function () {
  $('#drop-zone').hide()
})
