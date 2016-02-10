const router = require('koa-router')()

router.get('/', function *() {
  yield this.render('dashboard', {
    pageTitle: 'Dashboard'
  })
})

module.exports = router
