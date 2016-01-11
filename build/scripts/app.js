import $ from './select'
import { tryCreditals, adjustBorder } from './login'

const inputs = $('.login input')

$('.login form').addEventListener('submit', tryCreditals)

for (var i = 0; i < inputs.length; i++) {
  inputs[i].addEventListener('keyup', adjustBorder)
}

const chest = $('#chest')
const nav = chest.querySelector('nav')

if (chest.tagName !== 'ASIDE') {
  chest.querySelector('.toggle').addEventListener('click', function (event) {
    nav.classList.toggle('open')
    this.classList.toggle('on')

    event.preventDefault()
  })
}

const fileSelector = $('#selectMedia [type="file"]')
const button = $('#title .add')

function sendFile () {
  this.closest('form').submit()
  this.removeEventListener('change', sendFile)
}

button.addEventListener('click', function (event) {
  fileSelector.click()
  fileSelector.addEventListener('change', sendFile)

  event.preventDefault()
})

$('#selectMedia').addEventListener('submit', function (event) {
  const form = event.target
  const data = new FormData(form)
  const request = new XMLHttpRequest()

  request.addEventListener('readystatechange', function () {
    console.log(request.responseText)
  })

  request.open('POST', '/admin/media/upload')
  request.send(data)

  event.preventDefault()
})
