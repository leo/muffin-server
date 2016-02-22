const router = require('koa-router')()
const etc = require('../etc').log
const queryString = require('query-string')
const User = require('../models/user')

router.get('/', function *() {
  const url = this.request.originalUrl
  const params = queryString.parse(this.request.querystring)

  try {
    var users = yield User.find()
  } catch (err) {
    return log('Not able to list users', err)
  }

  for (var user in users) {
    users[user].title = users[user]._id
  }

  if (params.deleted) {
    const username = decodeURIComponent(params.deleted)

    const notify = {
      type: 'success',
      content: `Successfully deleted user "${username}"!`
    }
  }

  yield this.render('list', {
    pageTitle: 'Users',
    path: url,
    slug: url.split('/')[2],
    list: true,
    items: users,
    message: notify || false
  })
})

router.get('/:id', function *() {
  const query = User.where({ _id: this.params.id })

  try {
    var user = yield query.findOne()
  } catch (err) {
    return log('Not able to find user', err)
  }

  yield this.render('edit', {
    pageTitle: user._id,
    path: this.request.originalUrl
  })
})

router.get('/delete/:id', function *(next) {
  const query = User.where({ _id: this.params.id })

  try {
    var user = yield query.findOne()
  } catch (err) {
    log('Couldn\'t load user', err)
  }

  if (!user) {
    this.body = 'Couldn\'t find user'
    yield next

    return
  }

  try {
    user.remove()
  } catch (err) {
    return log(err)
  }

  const username = encodeURIComponent(user._id)
  this.response.redirect('/admin/users/?deleted=' + username)
})

module.exports = router
