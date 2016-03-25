const koa = require('koa')
const serve = require('koa-static')
const mount = require('koa-mount')
const compress = require('koa-compress')
const handlebars = require('koa-handlebars')
const router = require('koa-router')()
const sendfile = require('koa-sendfile')
const bodyParser = require('koa-body')
const jwt = require('koa-jwt')

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

if (module.parent) {
  require('dotenv').config({
    path: process.cwd() + '/.env'
  })
} else {
  // This is fine since it's only being used in the development env
  process.env.SESSION_SECRET = 'random'
}

app.use(compress())

router.use('/api', jwt({
  secret: process.env.SESSION_SECRET
}).unless({
  path: [/token-auth/, /token-refresh/, /reset-password/]
}))

router.use(bodyParser({
  multipart: true
}))

function getRoutes (path) {
  return require('./routes/' + path).routes()
}

router.use('/uploads*', getRoutes('uploads'))

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

const frontRouter = require('./routes/front')

frontRouter.use(handlebars({
  cache: app.env !== 'development',
  root: process.cwd() + '/views',
  layoutsDir: '../layouts',
  viewsDir: '/',
  defaultLayout: 'default',
  helpers
}))

router.use('/', frontRouter.routes())

app.router = router

app.listening = function () {
  const port = this.address().port
  const url = 'http://localhost:' + port

  console.log('Running!')
}

module.exports = app
