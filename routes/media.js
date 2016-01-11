const express = require('express')
const router = express.Router()
const File = require('../lib/models/file')

const grid = require('gridfs-stream')
const combinedStream = require('combined-stream').create()

const db = require('../lib/db')
const mongoose = db.goose
const conn = db.rope

grid.mongo = mongoose.mongo

const gfs = grid(conn.db)

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
    const writestream = gfs.createWriteStream({
      filename: filename,
      root: 'media',
      content_type: mimetype
    })

    combinedStream.append(file)
    combinedStream.pipe(writestream)

    writestream.on('close', function (file) {
      console.log('Yeah!')
      res.send(filename + ' was written to DB')
    })
  })

  req.pipe(req.busboy)
})

module.exports = router
