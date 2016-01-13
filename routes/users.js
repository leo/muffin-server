const express = require('express')
const router = express.Router()
const User = require('../lib/models/user')

router.get('/', function (req, res) {
  const url = req.originalUrl

  function listUsers (err, users) {
    if (err) {
      throw err
    }

    for (var user in users) {
      users[user].title = users[user]._id
    }

    res.render('list', {
      pageTitle: 'Users',
      path: url,
      slug: url.split('/')[2],
      list: true,
      items: users
    })
  }

  User.find({}, listUsers)
})

router.get('/:id', function (req, res) {
  const query = User.where({ _id: req.params.id })

  function loadUser (err, user) {
    if (err) {
      throw err
    }

    res.render('edit', {
      pageTitle: user._id,
      path: req.originalUrl
    })
  }

  query.findOne(loadUser)
})

module.exports = router
