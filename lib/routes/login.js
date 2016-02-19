const router = require('koa-router')()
const etc = require('../etc')
const log = etc.log

const User = require('../models/user')

router.use(function *(next) {
  if (this.session.loggedIn) {
    this.response.redirect('/admin')
  } else {
    yield next
  }
})

router.get('/', function *() {
  const tags = {
    outer: true,
    pageTitle: 'Login'
  }

  this.session = null
  yield this.render('login', tags)
})

router.get('/reset-password', function *() {
  const tags = {
    pageTitle: 'Reset password',
    outer: true
  }

  yield this.render('reset-password', tags)
})

router.post('/reset-password', function *(next) {
  const body = this.request.body

  if (!body.username) {
    this.body = {
      success: false,
      message: 'User and/or password empty'
    }

    return
  }

  const query = User.where({ _id: body.username })

  try {
    var user = yield query.findOne()
  } catch (err) {
    log('Couldn\'t load users', err)
  }

  if (!user) {
    this.body = {
      success: false,
      message: 'User not existing'
    }

    return
  }

  etc.resetPassword(user.email)

  this.body = {
    success: true
  }

  yield next
})

router.post('/', function *(next) {
  const body = this.request.body

  if (!body.username || !body.password) {
    this.body = {
      success: false,
      message: 'User and/or password empty'
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
    this.body = {
      success: false,
      message: 'User not existing'
    }

    return
  }

  // Compare password with the one within the DB
  const isMatch = user.tryPassword(body.password)

  if (isMatch) {
    this.session.loggedIn = true

    this.body = {
      success: true
    }

    return
  }

  this.body = {
    success: false,
    message: 'Wrong password'
  }

  yield next
})

module.exports = router
