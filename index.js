const koa = require('koa')
const serve = require('koa-static')
const mount = require('koa-mount')
const compress = require('koa-compress')
const handlebars = require('koa-handlebars')
const router = require('koa-router')()
const sendfile = require('koa-sendfile')
const bodyParser = require('koa-body')

const db = require('./lib/db')
const helpers = require('./lib/helpers')
const log = require('./lib/log')

const app = koa()
const rope = db.rope

process.on('SIGINT', () => {
  rope.close(() => {
    process.exit(0)
  })
})

app.use(compress())

router.use(bodyParser({
  multipart: true
}))

function getRoutes (path) {
  return require('./routes/' + path).routes()
}

router.use('/uploads*', getRoutes('uploads'))
router.use('/token', getRoutes('token'))

router.use('/api', getRoutes('api'))

// Serve ember app and frontend assets
app.use(mount('/assets', serve(process.cwd() + '/dist')))
app.use(mount('/admin', serve(__dirname + '/dist')))

router.get('/admin*', function *() {
  yield* sendfile.call(this, __dirname + '/dist/index.html')
  if (!this.status) this.throw(404)
})

router.get('/login', function *(next) {
  yield next
  this.redirect('/admin/login')
})

app.use(function *(next){
  var start = new Date
  yield next
  var ms = new Date - start
  console.log('%s %s - %s', this.method, this.url, ms)
})

var hbsConfig = {
  cache: app.env !== 'development',
  root: process.cwd() + '/views',
  layoutsDir: '../layouts',
  viewsDir: '/',
  defaultLayout: 'default',
  helpers
}

function listening () {
  const port = this.address().port
  const url = 'http://localhost:' + port

  if (!module.parent) {
    console.log('Muffin is running at ' + url)
  }
}

app.router = require('./routes/front')

app.run = (front, config) => {
  // Allow kit to overwrite template options
  if (config && config.render) {
    Object.assign(hbsConfig, config.render)
  }

  // Require outer routes if run from kit
  if (front) {
    front.use(handlebars(hbsConfig))
    router.use('/', front.routes())
  }

  app.use(router.routes())
  app.use(router.allowedMethods())

  app.listen(2000, listening)
}

if (!module.parent) app.run()
module.exports = app
