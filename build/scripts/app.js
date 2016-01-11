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

const fileSelector = $('#selectMedia [type="file"]')
const button = $('#title .add')

fileSelector.on('change', function () {
  $(this).closest('form').submit()
})

button.click(function (event) {
  fileSelector.click()
  event.preventDefault()
})

const form = $('#selectMedia')
var dragTimer

$('#selectMedia').submit(function (event) {
  $.ajax({
    url: '/admin/media/upload',
    type: 'POST',
    data: new FormData(this),
    processData: false,
    contentType: false
  }).done(function (data) {
    form.removeClass('drag')
    window.clearTimeout(dragTimer)

    location.reload()
  }).fail(function () {
    console.log('Failed!')
  })

  event.preventDefault()
})

$(document).on('dragover', function () {
  form.addClass('drag')
  window.clearTimeout(dragTimer)
})

$(document).on('dragleave', function () {
  dragTimer = window.setTimeout(function () {
    form.removeClass('drag')
  }, 25)
})
