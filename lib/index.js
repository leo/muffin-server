import chalk from 'chalk'
import http from 'http'
import fs from 'fs-extra'

import Koa from 'koa'
import serve from 'koa-static'
import mount from 'koa-mount'
import compress from 'koa-compress'
import Router from 'koa-router'
import bodyParser from 'koa-body'
import jwt from 'koa-jwt'
import convert from 'koa-convert'

import { rope } from './utils/db'
import { log } from './utils/utils'
import frontRouter from './routes/front'
import Config from './utils/config'

const router = new Router()
const app = new Koa()

// Loads .env and puts variables into process.env
const envFile = new Config()

app.use(compress())

router.use('/api', convert(jwt({
  secret: process.env.SESSION_SECRET
}).unless({
  path: [/token-auth/, /token-refresh/, /reset-password/]
})))

router.use(convert(bodyParser({
  multipart: true
})))

// Retrieve routes from passed path
const getRouter = (path) => require('./routes/' + path).default

const APIroutes = [
  'content',
  'reset-password',
  'token',
  'upload'
]

// Register media routes and API
const uploadRouter = getRouter('uploads')

router.use('/uploads*', uploadRouter.routes())
router.use('/uploads*', uploadRouter.allowedMethods())

for (let route of APIroutes) {
  let subRouter = getRouter('api/' + route)

  router.use('/api', subRouter.routes())
  router.use('/api', subRouter.allowedMethods())
}

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

function listening() {
  const port = this.address().port
  const url = 'http://localhost:' + port

  // Output message as soon as server is running
  console.log(chalk.blue('[muffin]') + ' ' + 'Running at ' + chalk.grey(url))
}

// Export front router
app.router = frontRouter

app.run = outerRouter => {
  // Register front routes
  router.use('/', outerRouter.routes())
  router.use('/', outerRouter.allowedMethods())

  // Register dashboard routes
  app.use(router.routes())
  app.use(router.allowedMethods())

  app.listen(process.env.PORT, listening)
}

module.exports = app
