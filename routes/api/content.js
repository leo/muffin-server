import Router from 'koa-router'
import { all, one } from '../../lib/get'

const router = new Router()
const singular = (type) => type.substring(0, type.length - 1)

router.get('/:type', async (ctx, next) => {
  const type = ctx.params.type

  ctx.body = {
    data: await all(singular(type))
  }

  await next
})

router.get('/(.*)/:id', async (ctx, next) => {
  const type = ctx.req.url.split('/')[2]

  ctx.body = {
    data: await one(singular(type), this.params.id)
  }

  await next()
})

export default router
