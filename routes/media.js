const db = require('../lib/db')
const mongoose = db.goose
const conn = db.rope

const fs = require('fs')
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

router.post('/upload', function *(next) {
  const file = this.request.body.files.file

  const writestream = gfs.createWriteStream({
    filename: file.name,
    root: 'media',
    content_type: file.type
  })

  const content = fs.createReadStream(file.path)

  content.pipe(writestream)

  try {
    yield new Promise(function (resolve) {
      writestream.on('close', () => resolve())
    })
  } catch (err) {
    throw err
  }

  this.body = file.name + ' was written to DB'
  yield next

  fs.unlink(file.path, function (err) {
    if (err) throw err
  })
})

module.exports = router
