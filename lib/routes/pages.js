const router = require('koa-router')()
const Page = require('../lib/models/page')

router.get('/', function *() {
  const url = this.request.originalUrl

  try {
    var pages = yield Page.find()
  } catch (err) {
    throw err
  }

  for (var page in pages) {
    pages[page] = pages[page].toObject()
  }

  yield this.render('list', {
    pageTitle: 'Pages',
    path: url,
    slug: url.split('/')[2],
    list: true,
    items: pages
  })
})

router.get('/:id', function *() {
  const query = Page.where({ _id: this.params.id })

  try {
    var page = yield query.findOne()
  } catch (err) {
    throw err
  }

  yield this.render('edit', {
    pageTitle: page.title,
    editableTitle: true,
    path: this.request.originalUrl
  })
})

module.exports = router
