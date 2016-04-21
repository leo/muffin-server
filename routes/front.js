import KoaRouter from 'koa-router'
import views from 'koa-views'
import { log } from '../lib/utils'
import helpers from '../lib/helpers'
import Page from '../models/page'

const router = new KoaRouter()

let details = {
  site: {
    title: 'Peter Griffin'
  },
  year: new Date().getFullYear()
}

router.use(views(process.cwd() + '/views', {
  extension: 'hbs',
  map: { hbs: 'handlebars' }
}))

router.use(async (ctx, next) => {
  let pages = false

  try {
    pages = await Page.find().sort({ _id: 1 })
  } catch (err) {
    log('Couldn\'t load pages', err)
  }

  if (!pages) {
    ctx.status = 500
    ctx.body = 'Couldn\'t load pages'

    return
  }

  for (let page in pages) {
    pages[page] = pages[page].toObject()
  }

  ctx.pages = pages
  await next()
})

router.get('*', async (ctx, next) => {
  details.site.canonical = ctx.request.origin
  const path = ctx.request.url

  details.pages = ctx.pages
  let result = false

  try {
    result = await Page.findOne({
      slug: path.split('/')[1]
    })
  } catch (err) {
    log('Not able to load page', err)
  }

  if (!result) {
    return
  }

  Object.assign(details, result.toObject())
  const kind = path === '/' ? 'index' : 'page'

  try {
    await ctx.render('index', details)
  } catch (err) {
    return log('Not able to render ' + kind, err)
  }

  await next()
})

export default router
