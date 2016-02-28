const koa = require('koa')
const static = require('koa-static')
const mount = require('koa-mount')

const app = koa()

app.use(mount('/admin', static('./dist')))

// logger

app.use(function *(next){
  var start = new Date
  yield next
  var ms = new Date - start
  console.log('%s %s - %s', this.method, this.url, ms)
})

// response

app.use(function *(){
  this.body = 'Hello World';
})

app.listen(2000, function () {
  const port = this.address().port
  const url = 'http://localhost:' + port

  console.log('API is running at ' + url)
})
