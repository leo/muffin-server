const express = require('express')
const app = express()
const handlebars = require('express-handlebars')
const session = require('express-session')

const compression = require('compression')
const bodyParser = require('body-parser')
const logger = require('morgan')
const rope = require('./lib/db').rope
const open = require('open')

const MongoStore = require('connect-mongo')(session)
const busboy = require('connect-busboy')
const livereload = require('connect-livereload')

process.on('SIGINT', function () {
  rope.close(function () {
    process.exit(0)
  })
})

app.disable('view cache')

app.use(livereload({
  disableCompression: true
}))

app.use(busboy({
  immediate: true
}))

app.use(session({
  secret: 'foo',
  name: 'muffin.session',
  store: new MongoStore({
    mongooseConnection: rope
  }),
  resave: false,
  saveUninitialized: true
}))

app.engine('hbs', handlebars({
  defaultLayout: 'main',
  extname: '.hbs',
  helpers: require('./lib/helpers')
}))

app.locals.menuItems = [
  {
    url: '.',
    title: 'Dashboard'
  },
  {
    url: 'pages',
    title: 'Pages'
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

app.locals.appVersion = require('./package.json').version
app.set('view engine', 'hbs')

app.use(compression())
app.use(logger('dev'))

app.use(function (req, res, next) {
  res.header('x-powered-by', 'Muffin CMS')
  next()
})

app.route('/admin*').all(function (req, res, next) {
  if (req.session.loggedIn || req.method === 'GET') {
    next()
  } else {
    res.send('Sorry, but I can\'t let you in.')
  }
}).get(function (req, res, next) {
  const url = req.url
  var to

  // Check if request wants a file. If so, let it through.
  if (url.match(/[^\\/]+\.[^\\/]+$/)) {
    return next()
  }

  if (req.session.loggedIn) {
    next()
  } else {
    switch (req.originalUrl) {
      case '/admin':
      case '/admin/':
        to = ''
        break

      default:
        to = '/?to=' + encodeURIComponent(req.originalUrl.replace('/admin/', ''))
    }

    res.redirect('/login' + to)
  }
})

app.use('/admin/assets', express.static('./dist'))
app.use('/admin', express.static('./public'))

app.use(bodyParser.json())

app.use(bodyParser.urlencoded({
  extended: true
}))

app.use('/login', require('./routes/login'))
app.use('/uploads*', require('./routes/uploads'))

app.use('/admin', require('./routes/dashboard'))
app.use('/admin/pages', require('./routes/pages'))
app.use('/admin/media', require('./routes/media'))

app.listen(2000, function () {
  const port = this.address().port
  const url = 'http://localhost:' + port + '/admin'

  console.log('Muffin is running at ' + url)

  if (!process.env.restarted) {
    open(url)
    process.env.restarted = false
  }
})
