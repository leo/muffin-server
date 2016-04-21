import Koa from 'koa'
import chalk from 'chalk'
import http from 'http'
import fs from 'fs-extra'

import serve from 'koa-static'
import mount from 'koa-mount'
import compress from 'koa-compress'
import KoaRouter from 'koa-router'
import bodyParser from 'koa-body'
import jwt from 'koa-jwt'

import { rope } from './lib/db'
import { log } from './lib/utils'
import frontRouter from './routes/front'

const router = new KoaRouter()
const app = new Koa()

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

// Retrieve routes from passed path
const getRoutes = (path) => require('./routes/' + path).default.routes()

const APIroutes = [
  'content',
  'reset-password',
  'token',
  'upload'
]

// Register media routes and API
router.use('/uploads*', getRoutes('uploads'))

/*
for (let route of APIroutes) {
  router.use('/api', getRoutes('api/' + route))
}*/

// Serve assets of admin area...
app.use(mount('/admin', serve(__dirname + '/client')))

// ...and the Ember app
router.get('/admin*', async (ctx, next) => {
  let indexContent = false
  let indexPath = __dirname + '/client/index.html'

  try {
    indexContent = fs.readFileSync(indexPath, {
      encoding: 'utf8'
    })
  } catch (err) {
    return log(err)
  }

  ctx.body = indexContent
  await next()
})

// Serve frontend assets
app.use(mount('/assets', serve(process.cwd() + '/dist')))

// Redirect users from "/login" to the Ember app login
router.get('/login', async (ctx, next) => {
  ctx.redirect('/admin/login')
  await next()
})

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

// Export front router
app.router = frontRouter

app.run = function () {
  // Register front routes
  router.use('/', frontRouter.routes())
  router.use('/', frontRouter.allowedMethods())

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
