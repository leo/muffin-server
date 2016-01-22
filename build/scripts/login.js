function queryVariable (name) {
  const query = window.location.search.substring(1)
  const vars = query.split('&')

  for (var i = 0; i < vars.length; i++) {
    var pair = vars[i].split('=')
    if (pair[0] === name) {
      return pair[1]
    }
  }

  return (false)
}

export function adjustBorder (event) {
  const code = event.which

  if (code === 13 || code === 9) {
    return
  }

  this.classList.remove('wrong')
}

export function tryCreditals (event) {
  event.preventDefault()

  if (this.classList.contains('shake')) {
    return
  }

  const httpRequest = new XMLHttpRequest()
  const form = this
  const inputs = document.querySelectorAll('.login input')

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
}

export function resetPassword (event) {
  const httpRequest = new XMLHttpRequest()

  const fields = {
    username: this[0].value
  }

  httpRequest.addEventListener('readystatechange', function (data) {
    if (this.readyState !== 4) {
      return
    }

    const response = JSON.parse(this.responseText)

    console.log(response)
  })

  httpRequest.open('POST', document.URL)
  httpRequest.setRequestHeader('Content-Type', 'application/json;charset=UTF-8')
  httpRequest.send(JSON.stringify(fields))

  event.preventDefault()
}
