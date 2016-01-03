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

    res.render('list', {
      pageTitle: 'Pages',
      path: req.originalUrl,
      items: pages
    });

  }

  Page.find({}, listPages);

});

router.get('/:id', function(req, res) {

  function loadPage(err, page) {

    if (err) {
      return console.log(body);
    }

    res.render('edit', {
      pageTitle: page.title,
      editableTitle: true,
      path: req.originalUrl
    });

  }

  db.get(req.params.id, loadPage);

});

module.exports = router;
