const koa = require('koa')
const open = require('open')

const app = koa()

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

process.once('SIGUSR2', function () {
  process.env.restarted = true
})

app.listen(3000, function () {
  const port = this.address().port
  const path = module.parent ? '' : '/admin'
  const url = 'http://localhost:' + port + path

  console.log('Muffin is running at ' + url)

  if (!process.env.restarted) {
    open(url)
    process.env.restarted = false
  }
})
