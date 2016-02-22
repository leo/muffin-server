const router = require('koa-router')()
const log = require('../etc').log
const queryString = require('query-string')
const Page = require('../models/page')

router.get('/', function *() {
  const url = this.request.originalUrl
  const params = queryString.parse(this.request.querystring)

  try {
    var pages = yield Page.find()
  } catch (err) {
    return log('Couldn\'t load pages', err)
  }

  for (var page in pages) {
    pages[page] = pages[page].toObject()
  }

  if (params.deleted) {
    const pageTitle = decodeURIComponent(params.deleted)

    const notify = {
      type: 'success',
      content: `Successfully deleted page "${pageTitle}"!`
    }
  }

  yield this.render('list', {
    pageTitle: 'Pages',
    path: url,
    slug: url.split('/')[2],
    list: true,
    items: pages,
    message: notify || false
  })
})

router.get('/:id', function *() {
  const query = Page.where({ _id: this.params.id })

  try {
    var page = yield query.findOne()
  } catch (err) {
    return log('Couldn\'t load page', err)
  }

  yield this.render('edit', {
    pageTitle: page.title,
    editableTitle: true,
    path: this.request.originalUrl
  })
})

router.get('/delete/:id', function *(next) {
  const query = Page.where({ _id: this.params.id })

  try {
    var page = yield query.findOne()
  } catch (err) {
    log('Couldn\'t load page', err)
  }

  if (!page) {
    this.body = 'Couldn\'t find page'
    yield next

    return
  }

  try {
    page.remove()
  } catch (err) {
    return log(err)
  }

  this.response.redirect('/admin/pages/?deleted=' + encodeURIComponent(page.title))
})

module.exports = router
