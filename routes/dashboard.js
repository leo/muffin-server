const express = require('express')
const router = express.Router()

router.get('/', function (req, res) {
  res.render('dashboard', {
    pageTitle: 'Dashboard'
  })
})

module.exports = router
