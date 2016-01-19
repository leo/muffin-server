const koa = require('koa')
const app = koa()

const handlebars = require('koa-handlebars')
const session = require('koa-generic-session')
const mongoStore = require('koa-session-mongoose')
const bodyParser = require('koa-body')
const livereload = require('koa-livereload')
// const compression = require('koa-compress')
const router = require('koa-router')()
const serve = require('koa-static')
const mount = require('koa-mount')

require('dotenv').config({
  path: './.env'
})

const rope = require('./lib/db').rope
const open = require('open')

process.on('SIGINT', function () {
  rope.close(function () {
    process.exit(0)
  })
})

app.keys = [ process.env.SESSION_SECRET ]

app.use(session({
  store: mongoStore.create(),
  connection: rope
}))

app.use(livereload({
  port: 35729
}))

router.use(bodyParser({
  multipart: true
}))

var globals = {}

globals.menuItems = [
  {
    url: '.',
    title: 'Dashboard'
  },
  {
    url: 'pages',
    title: 'Pages'
  },
  {
    url: 'users',
    title: 'Users'
  },
  {
    url: 'media',
    title: 'Media'
  },
  {
    url: 'settings',
    title: 'Settings'
  }
]

globals.appVersion = require('./package.json').version

app.use(handlebars({
  defaultLayout: 'main',
  cache: false,
  helpers: require('./lib/helpers'),
  root: __dirname + '/views',
  viewsDir: '/',
  data: globals
}))

// app.use(compression())

app.use(function *(next) {
  this.set('x-powered-by', 'Muffin CMS')
  yield next
})

router.all('/admin*', function *(next) {
  if (this.session.loggedIn || this.request.method === 'GET') {
    yield next
  } else {
    this.response.body('Sorry, but I can\'t let you in.')
  }
})

router.get('/admin*', function *(next) {
  const url = this.request.url
  var to

  // Check if request wants a file. If so, let it through.
  if (url.match(/[^\\/]+\.[^\\/]+$/)) {
    yield next
  }

  if (this.session.loggedIn) {
    yield next
  } else {
    const original = this.request.originalUrl

    switch (original) {
      case '/admin':
      case '/admin/':
        to = ''
        break

      default:
        to = '/?to=' + encodeURIComponent(original.replace('/admin/', ''))
    }

    this.response.redirect('/login' + to)
  }
})

app.use(mount('/admin', serve(__dirname + '/public')))
app.use(mount('/admin/assets', serve(__dirname + '/dist')))

function getRoutes (path) {
  return require('./routes/' + path).routes()
}

router.use('/login', getRoutes('login'))
router.use('/uploads*', getRoutes('uploads'))

router.use('/admin', getRoutes('dashboard'))
router.use('/admin/pages', getRoutes('pages'))
router.use('/admin/users', getRoutes('users'))
router.use('/admin/media', getRoutes('media'))

app.listen(2000, function () {
  const port = this.address().port
  const url = 'http://localhost:' + port

  console.log('Muffin is running at ' + url)

  if (!process.env.restarted) {
    open(url)
    process.env.restarted = false
  }
})

router.get('/', function *() {
  /*
  this.render('index', {
    layout: false,
    viewRoot: './views'
  })
  */
})

app.use(router.routes())
app.use(router.allowedMethods())

exports.app = app
