import koa from 'koa'
import chalk from 'chalk'
import http from 'http'

import serve from 'koa-static'
import mount from 'koa-mount'
import compress from 'koa-compress'
import handlebars from 'koa-handlebars'
import koaRouter from 'koa-router'
import sendfile from 'koa-sendfile'
import bodyParser from 'koa-body'
import jwt from 'koa-jwt'

import { rope } from './lib/db'
import helpers from './lib/helpers'
import { log } from './lib/utils'

const router = koaRouter()
const app = koa()

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
  // Retrieve routes from passed path
  return require('./routes/' + path).routes()
}

const APIroutes = [
  'content',
  'reset-password',
  'token',
  'upload'
]

// Register media routes and API
router.use('/uploads*', getRoutes('uploads'))

for (let route of APIroutes) {
  router.use('/api', getRoutes('api/' + route))
}

// Serve assets of admin area...
app.use(mount('/admin', serve(__dirname + '/client')))

// ...and the Ember app
router.get('/admin*', function *() {
  yield* sendfile.call(this, __dirname + '/client/index.html')
  if (!this.status) this.throw(404)
})

// Serve frontend assets
app.use(mount('/assets', serve(process.cwd() + '/dist')))

router.get('/login', function *(next) {
  yield next
  this.redirect('/admin/login')
})

// Log HTTP requests to console
app.use(function *(next){
  let start = new Date
  yield next
  let ms = new Date - start

  if (this.url.split('/')[1] == 'api') {
    return
  }

  console.log(chalk.blue('[muffin]') + ' %s %s - %sms', this.method, this.url, ms)
})

// Load front routes
import frontRouter from './routes/front'

// Enable new instance of rendering engine for front
frontRouter.use(handlebars({
  cache: app.env !== 'development',
  root: process.cwd() + '/views',
  layoutsDir: '../layouts',
  viewsDir: '/',
  defaultLayout: 'default',
  helpers
}))

app.router = frontRouter

app.run = function (frontRouter) {
  // Register front routes
  router.use('/', frontRouter.routes())
  router.use('/', frontRouter.allowedMethods())

  app.use(router.routes())
  app.use(router.allowedMethods())

  app.listen(process.env.PORT || 2000, function () {
    const port = this.address().port
    const host = 'localhost'
    const url = 'http://' + host + ':' + port

    console.log(chalk.blue('[muffin]') + ' ' + 'Running at ' + chalk.grey(url))
  })
}

module.exports = app
