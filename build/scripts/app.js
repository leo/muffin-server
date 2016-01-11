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

function sendFile () {
  $(this).closest('form').submit()
  $(this).unbind('change', sendFile)
}

button.click(function (event) {
  fileSelector.click()
  fileSelector.on('change', sendFile)

  event.preventDefault()
})

$('#selectMedia').submit(function (event) {
  $.ajax({
    url: '/admin/media/upload',
    type: 'POST',
    data: new FormData(this),
    processData: false,
    contentType: false
  }).done(function (data) {
    alert(data)
  }).fail(function () {
    console.log('Failed!')
  })

  event.preventDefault()
})
