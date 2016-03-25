const router = require('koa-router')()
const log = require('../lib/log')
const Page = require('../models/page')

var details = {
  site: {
    title: 'Peter Griffin'
  },
  year: new Date().getFullYear()
}

router.use(function *(next) {
  try {
    var pages = yield Page.find().sort({ _id: 1 })
  } catch (err) {
    log('Couldn\'t load pages', err)
  }

  if (!pages) {
    this.status = 500
    this.body = 'Couldn\'t load pages'
    return
  }

  for (var page in pages) {
    pages[page] = pages[page].toObject()
  }

  this.pages = pages
  yield next
})

router.get('*', function *(next) {
  details.site.canonical = this.request.origin
  const path = this.request.url

  details.pages = this.pages

  try {
    var result = yield Page.findOne({
      slug: path.split('/')[1]
    })
  } catch (err) {
    log('Not able to load page', err)
  }

  if (!result) {
    yield next
    return
  }

  Object.assign(details, result.toObject())

  if (path === '/') {
    yield this.render('index', details)
    return next
  }

  yield this.render('page', details)
  yield next
})

module.exports = router
