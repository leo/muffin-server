const router = require('koa-router')()
const handlebars = require('koa-handlebars')

router.use(handlebars({
  cache: false,
  root: process.cwd() + '/views',
  viewsDir: '/'
}))

router.get('/', function *() {
  yield this.render('index', {
    layout: false
  })
})

module.exports = router
