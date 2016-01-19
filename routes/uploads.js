const router = require('koa-router')()
const path = require('path')
const gfs = require('../lib/db').fs

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

  const stream = gfs.createReadStream(query)

  function getMeta () {
    return new Promise(function (resolve, reject) {
      gfs.findOne(query, function (err, meta) {
        if (err) reject(err)
        else resolve(meta)
      })
    })
  }

  try {
    var meta = yield getMeta()
  } catch (err) {
    throw err
  }

  this.set({
    'Content-Type': meta.contentType,
    'Content-Length': meta.length,
    'Cache-Control': 'max-age=31536000'
  })

  this.body = stream
  yield next
})

module.exports = router
