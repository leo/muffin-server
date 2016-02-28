const koa = require('koa')
const static = require('koa-static')
const mount = require('koa-mount')
const compress = require('koa-compress')

const app = koa()

app.use(compress())
app.use(mount('/admin', static('./dist')))

app.use(function *(next){
  var start = new Date
  yield next
  var ms = new Date - start
  console.log('%s %s - %s', this.method, this.url, ms)
})

process.once('SIGUSR2', () => {
  process.env.restarted = true
})

app.use(function *(){
  this.body = 'Hello World';
})

app.listen(2000, function () {
  const port = this.address().port
  const url = 'http://localhost:' + port

  console.log('Muffin is running at ' + url)

  if (!process.env.restarted && app.env === 'development') {
    require('open')(url)
    process.env.restarted = false
  }
})
