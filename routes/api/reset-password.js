import { parse, extract } from 'query-string'
import Router from 'koa-router'
import User from '../../models/user'
import { log } from '../../lib/utils'

const router = new Router()

router.get('/reset-password', async (ctx, next) => {
  const queries = extract(ctx.request.originalUrl)
  const _id = parse(queries).name

  if (!_id) {
    ctx.body = {
      error: 'No username'
    }

    return
  }

  const query = User.where({ _id })
  let user = false

  try {
    user = await query.findOne()
  } catch (err) {
    log('Couldn\'t load user', err)
  }

  if (!user) {
    ctx.body = {
      error: 'User doesn\'t exist'
    }

    return
  }

  ctx.body = {
    success: 'LOL'
  }

  await next()
})

export default router
