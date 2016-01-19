const db = require('../lib/db')
const mongoose = db.goose
const conn = db.rope

const router = require('koa-router')()
const File = require('../lib/models/file')
const grid = require('gridfs-stream')

const gfs = grid(conn.db, mongoose.mongo)

router.get('/', function *() {
  try {
    var results = yield File.find()
  } catch (err) {
    throw err
  }

  for (var file in results) {
    results[file] = results[file].toObject()
  }

  yield this.render('media', {
    pageTitle: 'Media',
    list: true,
    files: results
  })
})

router.post('/upload', function *() {
  /*
  req.busboy.on('file', function (fieldname, file, filename, encoding, mimetype) {
    const writestream = gfs.createWriteStream({
      filename: filename,
      root: 'media',
      content_type: mimetype
    })

    file.pipe(writestream)

    writestream.on('close', function (file) {
      console.log('Yeah!')
      res.send(filename + ' was written to DB')
    })
  })

  req.pipe(req.busboy)
  */
})

module.exports = router
