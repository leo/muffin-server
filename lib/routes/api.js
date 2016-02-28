const router = require('koa-router')()
const log = require('../etc').log
const User = require('../models/page')

router.post('/pages', function *(next) {
  try {
    var pages = yield Page.find()
  } catch (err) {
    return log('Couldn\'t load pages', err)
  }

  for (var page in pages) {
    pages[page] = pages[page].toObject()
  }

  this.body = pages
  yield next
})

module.exports = router
