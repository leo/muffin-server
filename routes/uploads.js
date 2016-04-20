import koaRouter from 'koa-router'
import path from 'path'
import { log } from '../lib/utils'
import { fs as gfs } from '../lib/db'

const router = koaRouter()

router.get('/', function *(next) {
  const query = {
    filename: path.basename(this.request.originalUrl),
    root: 'media'
  }

  try {
    let isAvailable = yield gfs.exist(query)
  } catch (err) {
    log('Not able to load file', err)
  }

  if (!isAvailable) {
    this.body = 'File doesn\'t exist!'
    return
  }

  // Read the requested file from the DB
  const stream = gfs.createReadStream(query)

  stream.on('error', log)

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
    let meta = yield metaData
  } catch (err) {
    return log('Not able to get file meta', err)
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
