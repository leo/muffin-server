const express = require('express'),
      router = express.Router(),
      nano = require('nano')('http://localhost:5984'),
      db = nano.use('muffin');

router.get('/', function(req, res) {

  db.list({ type: 'page', include_docs: true }, function(err, body) {

    if (err) {
      return console.log(err);
    }

    var list = [];

    body.rows.forEach(function(page) {
      list.push(page.doc)
    });

    res.render('list', {
      pageTitle: 'Pages',
      path: req.originalUrl,
      items: list
    });

  });

});

router.get('/:id', function(req, res) {

  res.render('edit', {
    pageTitle: 'LOL - what?',
    editableTitle: true,
    path: req.originalUrl
  });

});

module.exports = router;
