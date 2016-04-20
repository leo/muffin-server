import koaRouter from 'koa-router'
import { log } from '../lib/utils'
import Page from '../models/page'

const router = koaRouter()

let details = {
  site: {
    title: 'Peter Griffin'
  },
  year: new Date().getFullYear()
}

router.use(function *(next) {
  let pages = false

  try {
    pages = yield Page.find().sort({ _id: 1 })
  } catch (err) {
    log('Couldn\'t load pages', err)
  }

  if (!pages) {
    this.status = 500
    this.body = 'Couldn\'t load pages'
    return
  }

  for (let page in pages) {
    pages[page] = pages[page].toObject()
  }

  this.pages = pages
  yield next
})

router.get('*', function *(next) {
  details.site.canonical = this.request.origin
  const path = this.request.url

  yield next

  details.pages = this.pages
  let result = false

  try {
    result = yield Page.findOne({
      slug: path.split('/')[1]
    })
  } catch (err) {
    log('Not able to load page', err)
  }

  if (!result) {
    return
  }

  Object.assign(details, result.toObject())

  if (path === '/') {
    yield this.render('index', details)
    return
  }

  yield this.render('page', details)
})

module.exports = router
