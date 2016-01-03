const express = require('express'),
      router = express.Router(),
      nano = require('nano')('http://localhost:5984'),
      Page = require('../lib/db').Page,
      db = nano.use('muffin');

router.get('/', function(req, res) {

  function listPages(err, pages) {

    if (err) {
      throw err;
    }

    for (var page in pages) {
      pages[page] = pages[page].toObject()
    }

    res.render('list', {
      pageTitle: 'Pages',
      path: req.originalUrl,
      items: pages
    });

  }

  Page.find({}, listPages);

});

router.get('/:id', function(req, res) {

  const query = Page.where({ _id: req.params.id });

  function loadPage(err, page) {

    if (err) {
      throw err;
    }

    res.render('edit', {
      pageTitle: page.title,
      editableTitle: true,
      path: req.originalUrl
    });

  }

  query.findOne(loadPage);

});

module.exports = router;
