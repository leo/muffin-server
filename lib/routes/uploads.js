const router = require('koa-router')()
const path = require('path')
const gfs = require('../db').fs

router.get('/', function *(next) {
  const query = {
    filename: path.basename(this.request.originalUrl),
    root: 'media'
  }

  try {
    var isAvailable = yield gfs.exist(query)
  } catch (err) {
    throw err
  }

  if (!isAvailable) {
    this.body = 'File doesn\'t exist!'
    return
  }

  // Read the requested file from the DB
  const stream = gfs.createReadStream(query)

  stream.on('error', console.error)

  // Try to get the file's meta data and give back an error if one appears
  const metaData = new Promise((resolve, reject) => {
    gfs.findOne(query, (err, meta) => {
      if (err) {
        return reject(err)
      }

      resolve(meta)
    })
  })

  try {
    // Assign metadata to variable or throw error
    var meta = yield metaData
  } catch (err) {
    throw err
  }

  // Tell the client how to treat the data
  this.set({
    'Content-Type': meta.contentType,
    'Content-Length': meta.length,
    'Cache-Control': 'max-age=31536000'
  })

  // Send filestream to client
  this.body = stream

  yield next
})

module.exports = router
