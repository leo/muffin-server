import $ from './etc/select'
import queryVariable from './etc/query'

const form = $('form')
const inputs = $('input')

form.addEventListener('submit', function (event) {
  event.preventDefault()

  if (this.classList.contains('shake')) {
    return
  }

  const httpRequest = new XMLHttpRequest()

  httpRequest.addEventListener('readystatechange', function (data) {
    if (this.readyState !== 4) {
      return
    }

    const response = JSON.parse(this.responseText)

    if (this.status === 200 && response.success) {
      const query = queryVariable('to')
      const target = query ? '/' + decodeURIComponent(query) : ''

      window.location.replace('/admin' + target)
    } else {
      var timeout
      var arr = []

      clearTimeout(timeout)

      arr.forEach.call(inputs, function (input) {
        input.classList.add('wrong')
      })

      form.classList.add('shake')

      timeout = setTimeout(function () {
        form.classList.remove('shake')
      }, 1000)
    }
  })

  const fields = {
    username: this[0].value,
    password: this[1].value
  }

  httpRequest.open('POST', document.URL)
  httpRequest.setRequestHeader('Content-Type', 'application/json;charset=UTF-8')
  httpRequest.send(JSON.stringify(fields))
})

function adjustBorder (event) {
  const code = event.which

  if (code === 13 || code === 9) {
    return
  }

  this.classList.remove('wrong')
}

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

const fileSelector = $('#selectMedia input')
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
  event.preventDefault()

  const form = event.target
  const data = new FormData(form)
  const request = new XMLHttpRequest()

  request.addEventListener('readystatechange', function () {
    console.log(request.responseText)
  })

  request.open('POST', '/admin/media/upload')
  request.send(data)
})
