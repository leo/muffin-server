const router = require('koa-router')()
const handlebars = require('koa-handlebars')
const Page = require('../models/page')

var details = {
  site: {
    title: 'Peter Griffin'
  },
  year: new Date().getFullYear()
}

router.get('*', function *(next) {
  details.site.canonical = this.request.origin
  const path = this.request.url

  if (path === '/') {
    yield this.render('index', details)
    return next
  }

  try {
    const result = yield Page.findOne({
      slug: path.split('/')[1]
    })
  } catch (err) {
    throw err
  }

  if (!result) {
    this.body = '404 - Not found'
    return next
  }

  Object.assign(details, result.toObject())

  yield this.render('page', details)
  yield next
})

module.exports = router
