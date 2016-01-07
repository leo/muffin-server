const express = require('express')
const router = express.Router()
const Page = require('../lib/models/page')

router.get('/', function (req, res) {
  function listPages (err, pages) {
    if (err) {
      throw err
    }

    for (var page in pages) {
      pages[page] = pages[page].toObject()
    }

    res.render('list', {
      pageTitle: 'Pages',
      path: req.originalUrl,
      list: true,
      items: pages
    })
  }

  Page.find({}, listPages)
})

router.get('/:id', function (req, res) {
  const query = Page.where({ _id: req.params.id })

  function loadPage (err, page) {
    if (err) {
      throw err
    }

    res.render('edit', {
      pageTitle: page.title,
      editableTitle: true,
      path: req.originalUrl
    })
  }

  query.findOne(loadPage)
})

module.exports = router
