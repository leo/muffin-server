import Koa from 'koa'
import chalk from 'chalk'
import http from 'http'

import serve from 'koa-static'
import mount from 'koa-mount'
import compress from 'koa-compress'
import KoaRouter from 'koa-router'
import sendfile from 'koa-sendfile'
import bodyParser from 'koa-body'
import jwt from 'koa-jwt'
import convert from 'koa-convert'

import { rope } from './lib/db'
import { log } from './lib/utils'

const router = new KoaRouter()
const app = new Koa()

const _use = app.use
app.use = x => _use.call(app, convert(x))

app.use(compress())
/*
router.use('/api', jwt({
  secret: process.env.SESSION_SECRET
}).unless({
  path: [/token-auth/, /token-refresh/, /reset-password/]
}))*/
/*
router.use(bodyParser({
  multipart: true
}))*/

function getRoutes (path) {
  // Retrieve routes from passed path
  //return require('./routes/' + path).routes()
}

const APIroutes = [
  'content',
  'reset-password',
  'token',
  'upload'
]

// Register media routes and API
//router.use('/uploads*', getRoutes('uploads'))

for (let route of APIroutes) {
  //router.use('/api', getRoutes('api/' + route))
}

// Serve assets of admin area...
//app.use(mount('/admin', serve(__dirname + '/client')))

/*
// ...and the Ember app
router.get('/admin*', function *() {
  yield* sendfile.call(this, __dirname + '/client/index.html')
  if (!this.status) this.throw(404)
})*/

// Serve frontend assets
//app.use(mount('/assets', serve(process.cwd() + '/dist')))
/*
router.get('/login', function (ctx, next) {
  console.log('test')
  ctx.redirect('/admin/login')
  next()
})*/

// Log HTTP requests to console
app.use(async (ctx, next) => {
  let start = new Date

  try {
    await next()
  } catch(err) {
    ctx.body = { message: err.message }
    ctx.status = err.status || 500
  }

  let ms = new Date - start

  if (ctx.url.split('/')[1] == 'api') {
    return
  }

  console.log(chalk.blue('[muffin]') + ' %s %s - %sms', ctx.method, ctx.url, ms)
})




import frontRouter from './routes/front'

// Load front routes


// Enable new instance of rendering engine for front


//app.router = frontRouter

router.use('/', frontRouter.routes())
router.use('/', frontRouter.allowedMethods())

app.run = function (frontRouter) {
  // Register front routes
  //router.use('/', app.router.routes())
  //router.use('/', app.router.allowedMethods())

  // Register dashboard routes
  app.use(router.routes())
  app.use(router.allowedMethods())

  app.listen(process.env.PORT || 2000, function () {
    const port = this.address().port
    const host = 'localhost'
    const url = 'http://' + host + ':' + port

    // Output message as soon as server is running
    console.log(chalk.blue('[muffin]') + ' ' + 'Running at ' + chalk.grey(url))
  })
}

module.exports = app
