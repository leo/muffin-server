const router = require('koa-router')()
const Page = require('../models/page')

var details = {
  site: {
    title: 'Peter Griffin'
  },
  year: new Date().getFullYear()
}

router.use(function *(next) {
  try {
    var pages = yield Page.find()
  } catch (err) {
    throw err
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
    throw err
  }

  if (!result) {
    return next
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
