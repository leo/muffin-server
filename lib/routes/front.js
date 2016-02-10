const router = require('koa-router')()
const handlebars = require('koa-handlebars')

router.get('/', function *(next) {
  yield this.render('index')

  // Allow kit to add middleware to router
  yield next
})

module.exports = router
