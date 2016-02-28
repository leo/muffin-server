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
const log = require('./lib/etc').log

const User = require('./lib/models/user')

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

router.post('/token', function *(next) {
  const body = this.request.body

  if (body.grant_type !== 'password') {
    this.status = 400
    this.body = {
      error: 'Unsupported grant type'
    }
    return
  }

  if (!body.username || !body.password) {
    this.status = 400
    this.body = {
      error: 'User and/or password empty'
    }
    return
  }

  const query = User.where({ _id: body.username })

  try {
    var user = yield query.findOne()
  } catch (err) {
    log('Couldn\'t load user', err)
  }

  if (!user) {
    this.status = 400
    this.body = {
      error: 'User doesn\'t exist'
    }
    return
  }

  // Compare password with the one within the DB
  const isMatch = user.tryPassword(body.password)

  if (isMatch) {
    this.body = {
      access_token: 'ddddd'
    }

    return
  }

  this.status = 400

  this.body = {
    error: 'Wrong password'
  }

  yield next
})

// Serve frontend assets
app.use(mount('/assets', serve(process.cwd() + '/dist')))

// Serve ember app
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

process.once('SIGUSR2', () => {
  process.env.restarted = true
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

  console.log('Muffin is running at ' + url)

  if (!process.env.restarted && app.env === 'development') {
    require('open')(url)
    process.env.restarted = false
  }
}

app.router = require('./lib/routes/front')

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
