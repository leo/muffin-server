const express = require('express')
const router = express.Router()
const File = require('../lib/models/file')

router.get('/', function (req, res) {
  function listFiles (err, results) {
    if (err) {
      throw err
    }

    for (var file in results) {
      results[file] = results[file].toObject()
    }

    res.render('media', {
      pageTitle: 'Media',
      list: true,
      files: results
    })
  }

  File.find(listFiles)
})

router.post('/upload', function (req, res) {
  req.busboy.on('file', function (fieldname, file, filename, encoding, mimetype) {
    console.log(filename)
  })

  req.pipe(req.busboy)

  res.send('ok')
})

module.exports = router
