import koa from 'koa'
import program from 'commander'
import chalk from 'chalk'
import { exec } from 'child_process'
import enableDestroy from 'server-destroy'
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
import { log, isSite, exists } from './lib/utils'

const router = koaRouter()
const app = koa()

program
  .option('-w, --watch', 'Rebuild site if files change')
  .option('-p, --port <port>', 'The port on which your site will be available', parseInt)
  .parse(process.argv)

if (!isSite()) {
  log(chalk.red('No site in here!'))
  process.exit(1)
}

// Build before serving if "dist" directory doesn't exist
if (program.watch || !exists(process.cwd() + '/dist')) {
  const builder = exec('muffin build -w')

  builder.stdout.on('data', data => process.stdout.write(chalk.green(data)))
  builder.stderr.on('data', data => console.error(data))

  builder.on('error', err => {
    throw err
  })
}

app.use(compress())

if (program.watch) {
  const livereloadScript = require('koa-livereload')
  app.use(livereloadScript())
}

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
  return require('../lib/routes/' + path).routes()
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
app.use(mount('/admin', serve(__dirname + '/../client')))

// ...and the Ember app
router.get('/admin*', function *() {
  yield* sendfile.call(this, __dirname + '/../client/index.html')
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
import frontRouter from '../lib/routes/front'

// Enable new instance of rendering engine for front
frontRouter.use(handlebars({
  cache: app.env !== 'development',
  root: process.cwd() + '/views',
  layoutsDir: '../layouts',
  viewsDir: '/',
  defaultLayout: 'default',
  helpers
}))

// Register front routes
router.use('/', frontRouter.routes())

app.use(router.routes())
app.use(router.allowedMethods())

let server = http.createServer(app.callback())

server.listen(program.port || process.env.PORT, function () {
  const port = this.address().port
  const host = 'localhost'
  const url = 'http://' + host + ':' + port

  console.log(chalk.blue('[muffin]') + ' ' + 'Running at ' + chalk.grey(url))

  process.stdin.resume()
  process.stdin.setEncoding('utf8')
  enableDestroy(server)

  process.stdin.on('data', data => {
    data = (data + '').trim().toLowerCase()

    if (data === 'rs') {
      server.destroy()

      server = http.createServer(app.callback())

      server.listen(program.port || process.env.PORT, () => {
        enableDestroy(server)
        log(chalk.green('Restarted!'))
      })
    }
  })
})

if (program.watch) {
  const livereload = require('livereload')
  const livereloadServer = livereload.createServer()

  livereloadServer.watch(process.cwd() + '/dist')
}
