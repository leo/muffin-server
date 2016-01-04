const express = require('express'),
      router = express.Router();

router.get('/', function(req, res) {

  res.render('media', {
    pageTitle: 'Media',
    files: []
  });

});

module.exports = router;
