const router = require('koa-router')()
const handlebars = require('koa-handlebars')

router.get('/', function *(next) {
  const details = {
    site: {
      title: 'Peter Griffin',
      canonical: this.request.origin
    }
  }

  yield this.render('index', details)
  // Allow kit to add middleware to router
  yield next
})

module.exports = router
