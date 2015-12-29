const express = require('express'),
      router = express.Router();

router.get('/', function(req, res) {

  res.render('list', {
    pageTitle: 'Pages'
  });

});

module.exports = router;
