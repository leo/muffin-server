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

      const dates = page.doc.dates;

      for (var type in dates) {
        if (!dates.hasOwnProperty(type)) {
          continue;
        }

        var date = new Date(parseInt(dates[type]));
        page.doc.dates[type] = date.toLocaleDateString();
      }

      list.push(page.doc);
    });

    res.render('list', {
      pageTitle: 'Pages',
      path: req.originalUrl,
      items: list
    });

  });

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
