import { parse, extract } from 'query-string'
import koaRouter from 'koa-router'
import User from '../../models/user'
import { log } from '../../utils'

const router = koaRouter()

router.get('/reset-password', function *(next) {
  const queries = extract(this.request.originalUrl)
  const _id = parse(queries).name

  if (!_id) {
    this.body = {
      error: 'No username'
    }

    return
  }

  const query = User.where({ _id })

  try {
    var user = yield query.findOne()
  } catch (err) {
    log('Couldn\'t load user', err)
  }

  if (!user) {
    this.body = {
      error: 'User doesn\'t exist'
    }

    return
  }

  console.log(_id)

  this.body = {
    success: 'LOL'
  }
})

module.exports = router
