const router = require('koa-router')()
const User = require('../lib/models/user')

router.get('/', function *() {
  const url = this.request.originalUrl

  try {
    var users = yield User.find()
  } catch (err) {
    throw err
  }

  for (var user in users) {
    users[user].title = users[user]._id
  }

  yield this.render('list', {
    pageTitle: 'Users',
    path: url,
    slug: url.split('/')[2],
    list: true,
    items: users
  })
})

router.get('/:id', function *() {
  const query = User.where({ _id: this.params.id })

  try {
    var user = yield query.findOne()
  } catch (err) {
    throw err
  }

  yield this.render('edit', {
    pageTitle: user._id,
    path: this.request.originalUrl
  })
})

module.exports = router
