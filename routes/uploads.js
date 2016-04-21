import KoaRouter from 'koa-router'
import path from 'path'
import { log } from '../lib/utils'
import { fs as gfs } from '../lib/db'

const router = new KoaRouter()

router.get('/', async (ctx, next) => {
  const query = {
    filename: path.basename(ctx.request.originalUrl),
    root: 'media'
  }

  let isAvailable = false

  try {
    isAvailable = await gfs.exist(query)
  } catch (err) {
    log('Not able to load file', err)
  }

  if (!isAvailable) {
    ctx.body = 'File doesn\'t exist!'
    return
  }

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

  let meta = {}

  try {
    // Assign metadata to variable or throw error
    meta = await metaData
  } catch (err) {
    return log('Not able to get file meta', err)
  }

  // Tell the client how to treat the data
  ctx.set({
    'Content-Type': meta.contentType,
    'Content-Length': meta.length,
    'Cache-Control': 'max-age=31536000'
  })

  // Send filestream to client
  ctx.body = stream
  await next()
})

export default router
