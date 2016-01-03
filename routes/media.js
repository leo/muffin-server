const express = require('express'),
      router = express.Router(),
      File = require('../lib/db').File;

router.get('/', function(req, res) {

  function loadFiles(err, results) {

    if (err) {
      throw err;
    }

    res.render('media', {
      pageTitle: 'Media',
      files: results
    });

  }

  File.find({}, loadFiles);

});

module.exports = router;
