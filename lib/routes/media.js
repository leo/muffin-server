const db = require('../db')
const mongoose = db.goose
const conn = db.rope

const fs = require('fs')
const path = require('path')
const router = require('koa-router')()
const File = require('../models/file')
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

function detSeparator (handle) {
  var counts = {}

  const types = {
    spaces: ' ',
    dots: '.',
    underscores: '_',
    dashes: '-'
  }

  for (type in types) {
    if (!types.hasOwnProperty(type)) {
      continue
    }

    counts[type] = handle.split(types[type]).length - 1
  }

  const largest = Object.keys(counts).reduce((prev, curr) => {
    return counts[prev] > counts[curr] ? prev : curr
  })

  return types[largest]
}

router.post('/upload', function *(next) {
  const file = this.request.body.files.file
  const ext = path.extname(file.name)
  const name = path.basename(file.name, ext)

  // Determine the most used separator in the filename
  const separator = detSeparator(name)

  var id = 0

  // Encode filename as URI string
  function formatName (n) {
    return encodeURIComponent(name + ( n > 0 ? separator + n : '' ) + ext)
  }

  do {
    // Check if filename is already in DB
    try {
      var isAvailable = yield gfs.exist({
        filename: formatName(id),
        root: 'media'
      })
    } catch (err) {
      throw err
    }

    // Increase id if it's already in use
    if (isAvailable) {
      id++
    } else {
      // If not, simply go on
      break
    }
  } while (true)

  const writestream = gfs.createWriteStream({
    filename: formatName(id),
    root: 'media',
    content_type: file.type
  })

  // Get file from disk and pipe it to gfs's writestream
  const content = fs.createReadStream(file.path)
  content.pipe(writestream)

  try {
    yield new Promise((resolve) => {
      writestream.on('close', () => resolve())
    })
  } catch (err) {
    throw err
  }

  this.body = file.name + ' was written to DB'
  yield next

  // Remove temporary file after response
  fs.unlink(file.path, function (err) {
    if (err) throw err
  })
})

module.exports = router
