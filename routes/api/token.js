import Router from 'koa-router'
import jwt from 'koa-jwt'
import bodyParser from 'koa-body'
import User from '../../models/user'
import { log } from '../../lib/utils'

const router = new Router()

router.post('/token-auth', async (ctx, next) => {
  const body = ctx.request.body

  if (!body.username || !body.password) {
    ctx.status = 400
    ctx.body = {
      error: 'User and/or password empty'
    }

    return
  }

  const query = User.where({ _id: body.username })
  let user = false

  try {
    user = await query.findOne()
  } catch (err) {
    log('Couldn\'t load user', err)
  }

  if (!user) {
    ctx.status = 400

    ctx.body = {
      error: 'User doesn\'t exist'
    }

    return
  }

  // Compare password with the one within the DB
  const isMatch = user.tryPassword(body.password)

  if (isMatch) {
    const token = jwt.sign(body, process.env.SESSION_SECRET, {
      expiresIn: 300
    })

    ctx.body = { token }
    return
  }

  ctx.status = 400

  ctx.body = {
    error: 'Wrong password'
  }

  await next()
})

router.post('/token-refresh', async (ctx, next) => {
  const token = ctx.request.body.token
  let decoded = false

  try {
    decoded = jwt.verify(token, process.env.SESSION_SECRET)
  } catch (err) {
    ctx.status = 401
    ctx.body = { error: err }

    return
  }

  const query = User.where({ _id: decoded.username })
  let user = false

  try {
    user = await query.findOne()
  } catch (err) {
    log('Couldn\'t load user', err)
  }

  if (!user) {
    ctx.status = 401

    ctx.body = {
      error: 'User doesn\'t exist'
    }

    return
  }

  const isMatch = user.tryPassword(decoded.password)

  if (isMatch) {
    ctx.body = {
      token: jwt.sign(decoded, process.env.SESSION_SECRET, {
        expiresIn: 300
      })
    }

    return
  }

  ctx.status = 401

  ctx.body = {
    error: 'Wrong password'
  }

  await next()
})

export default router
