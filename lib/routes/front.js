const router = require('koa-router')()
const handlebars = require('koa-handlebars')

// Use a separate handlebars instance with different options
router.use(handlebars({
  cache: false,
  root: process.cwd() + '/views',
  layoutsDir: '../layouts',
  viewsDir: '/',
  defaultLayout: 'default'
}))

module.exports = router
