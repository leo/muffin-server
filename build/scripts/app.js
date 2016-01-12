import Dropzone from 'dropzone'
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

const drop = new Dropzone(document.body, {
  clickable: '#title .add',
  url: '/admin/media/upload',
  previewsContainer: '#files',
  previewTemplate: document.getElementById('preview-template').innerHTML,
  thumbnailWidth: 360,
  thumbnailHeight: 360
})

const zone = document.querySelector('#drop-zone')

drop.on('dragenter', function () {
  zone.classList.add('shown')
})

drop.on('drop', function () {
  zone.classList.remove('shown')
})
