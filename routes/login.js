const router = require('koa-router')()
const User = require('../lib/models/user')

router.use(function *(next) {
  if (this.request.url === '/login/bye') {
    yield next
    return
  }

  if (this.session.loggedIn) {
    this.response.redirect('/admin')
  } else {
    yield next
  }
})

router.get('/bye', function *() {
  this.session = null
  this.response.redirect('/login')
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
    throw err
  }

  if (!user) {
    this.body = {
      success: false,
      message: 'User not existing'
    }

    return
  }

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
