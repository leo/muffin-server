const express = require('express'),
      router = express.Router(),
      File = require('../lib/models/file');

router.get('/', function(req, res) {

  function listFiles(err, results) {

    if (err) {
      throw err;
    }

    for (var file in results) {
      results[file] = results[file].toObject();
    }

    res.render('media', {
      pageTitle: 'Media',
      list: true,
      files: results
    });

  }

  File.find(listFiles);

});

router.post('/upload', function(req, res) {

  req.busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
    console.log(filename);
  });

  res.send('ok');

});

module.exports = router;
