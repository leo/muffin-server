import KoaRouter from 'koa-router'
import views from 'koa-views'
import path from 'path'
import fs from 'fs'
import { log, exists, walkSync } from '../lib/utils'
import helpers from '../lib/helpers'
import Page from '../models/page'

const router = new KoaRouter()

let details = {
  site: {
    title: 'Peter Griffin'
  },
  year: new Date().getFullYear()
}

let viewDir = path.normalize(process.cwd() + '/views')
let partialDir = path.normalize(viewDir + '/partials')

const getPartials = () => {
  let partials = {}

  // fs-extra already has a walker but it's asynchronous
  const partialFiles = walkSync(partialDir)

  // Assign partials
  for (let partial of partialFiles) {
    let name = path.parse(partial).name
    partials[name] = 'partials/' + name
  }

  return partials
}

router.use(views(viewDir, {
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

  ctx.state = {
    helpers,
    partials: exists(partialDir) ? getPartials() : {}
  }

  details.slug = ctx.originalUrl.split('/')[1]

  try {
    await ctx.render('index', details)
  } catch (err) {
    return log('Not able to render ' + kind, err)
  }

  await next()
})

export default router
