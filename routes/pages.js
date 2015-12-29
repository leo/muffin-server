const express = require('express'),
      router = express.Router();

router.get('/', function(req, res) {

  res.render('list', {
    pageTitle: 'Pages',
    path: req.originalUrl
  });

});

module.exports = router;
