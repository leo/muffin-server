const router = require('koa-router')()
const log = require('../etc').log
const User = require('../models/user')

router.post('/', function *(next) {
  const body = this.request.body

  if (body.grant_type !== 'password') {
    this.status = 400
    this.body = {
      error: 'Unsupported grant type'
    }
    return
  }

  if (!body.username || !body.password) {
    this.status = 400
    this.body = {
      error: 'User and/or password empty'
    }
    return
  }

  const query = User.where({ _id: body.username })

  try {
    var user = yield query.findOne()
  } catch (err) {
    log('Couldn\'t load user', err)
  }

  if (!user) {
    this.status = 400
    this.body = {
      error: 'User doesn\'t exist'
    }
    return
  }

  // Compare password with the one within the DB
  const isMatch = user.tryPassword(body.password)

  if (isMatch) {
    this.body = {
      access_token: 'ddddd'
    }

    return
  }

  this.status = 400

  this.body = {
    error: 'Wrong password'
  }

  yield next
})

module.exports = router
