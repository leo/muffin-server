const router = require('koa-router')()
const log = require('../lib/log')
const Page = require('../models/page')

router.get('/pages', function *(next) {
  try {
    var pages = yield Page.find()
  } catch (err) {
    return log('Couldn\'t load pages', err)
  }

  for (var page in pages) {
    pages[page] = pages[page].toObject()
    pages[page].type = 'page'

    delete pages[page]._id
    delete pages[page].__v
  }

  console.log(pages)

  this.body = { data: pages }
  yield next
})

module.exports = router
