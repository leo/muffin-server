import Dropzone from 'dropzone'
import { tryCreditals, resetPassword, adjustBorder } from './login'

const inputs = document.querySelectorAll('.login input, .reset-password input')

const loginForm = document.querySelector('.login form')
const resetForm = document.querySelector('.reset-password form')

if (loginForm) {
  loginForm.addEventListener('submit', tryCreditals)
}

if (resetForm) {
  resetForm.addEventListener('submit', resetPassword)
}

for (var i = 0; i < inputs.length; i++) {
  inputs[i].addEventListener('keyup', adjustBorder)
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
