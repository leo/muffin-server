import Dropzone from 'dropzone'
import { tryFields, adjustBorder } from './login'

const loginForm = document.querySelector('.login form, .reset-password form')

if (loginForm) {
  loginForm.addEventListener('submit', tryFields)
  const inputs = loginForm.querySelectorAll('input')

  Array.prototype.forEach.call(inputs, input => {
    input.addEventListener('keyup', adjustBorder)
  })
}

const chest = document.querySelector('#chest')

if (chest) {
  const nav = chest.querySelector('nav')

  chest.querySelector('.toggle').addEventListener('click', function (event) {
    nav.classList.toggle('open')
    this.classList.toggle('on')

    event.preventDefault()
  })
}

if (document.body.classList.contains('media')) {
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

    const interval = setInterval(function () {
      if (document.body.classList.contains('dz-drag-hover')) {
        return
      }

      zone.classList.remove('shown')
      clearInterval(interval)
    }, 20)
  })

  drop.on('drop', function () {
    zone.classList.remove('shown')
  })
}

const files = document.querySelectorAll('#files figure')

function openMedia (event) {
  const image = this.querySelector('img').src
  window.open(image)

  event.preventDefault()
}

if (files) {
  Array.prototype.forEach.call(files, file => {
    file.addEventListener('click', openMedia)
  })
}
