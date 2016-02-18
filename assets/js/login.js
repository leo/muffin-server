function queryVariable (name) {
  const query = window.location.search.substring(1)
  const vars = query.split('&')

  for (var variable of vars) {
    var pair = variable.split('=')
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

export function tryFields (event) {
  event.preventDefault()

  var arr = []

  if (this.classList.contains('shake')) {
    return
  }

  const httpRequest = new XMLHttpRequest()
  const inputs = this.querySelectorAll('input')
  const form = this
  const isLogin = document.body.classList.contains('login')

  httpRequest.addEventListener('readystatechange', function (data) {
    if (this.readyState !== 4) {
      return
    }

    const response = JSON.parse(this.responseText)

    if (this.status === 200 && response.success) {
      if (isLogin) {
        const query = queryVariable('to')
        const target = query ? '/' + decodeURIComponent(query) : ''

        window.location.replace('/admin' + target)
      } else {
        alert('Yeah')
      }
    } else {
      var timeout

      clearTimeout(timeout)

      arr.forEach.call(inputs, input => {
        input.classList.add('wrong')
      })

      form.classList.add('shake')

      timeout = setTimeout(function () {
        form.classList.remove('shake')
      }, 1000)
    }
  })

  var fields = {}

  arr.forEach.call(inputs, input => {
    fields[input.name] = input.value
  })

  httpRequest.open('POST', document.URL)
  httpRequest.setRequestHeader('Content-Type', 'application/json;charset=UTF-8')
  httpRequest.send(JSON.stringify(fields))
}
