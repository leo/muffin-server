import koaRouter from 'koa-router'
import path from 'path'
import fs from 'fs-extra'
import { fs as gfs } from '../../lib/db'
import { log } from '../../lib/utils'

const router = koaRouter()

function detSeparator (handle) {
  let numbers = {}

  const types = {
    spaces: ' ',
    dots: '.',
    underscores: '_',
    dashes: '-'
  }

  for (let type in types) {
    if (!types.hasOwnProperty(type)) {
      continue
    }

    numbers[type] = handle.split(types[type]).length - 1
  }

  const largest = Object.keys(numbers).reduce((prev, curr) => {
    return numbers[prev] > numbers[curr] ? prev : curr
  })

  return types[largest]
}

router.get('/files', require('../uploads').routes())

router.post('/upload', function *(next) {
  const file = this.request.body.files.file
  const ext = path.extname(file.name)
  const name = path.basename(file.name, ext)

  // Determine the most used separator in the filename
  const separator = detSeparator(name)

  let id = 0

  // Encode filename as URI string
  function formatName (n) {
    return encodeURIComponent(name + (n > 0 ? separator + n : '') + ext)
  }

  let isAvailable = false

  do {
    // Check if filename is already in DB
    try {
      isAvailable = yield gfs.exist({
        filename: formatName(id),
        root: 'media'
      })
    } catch (err) {
      return log('Couldn\'t check if media exists', err)
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
    yield new Promise(resolve => {
      writestream.on('close', () => resolve())
    })
  } catch (err) {
    return log('Not able to save media', err)
  }

  this.body = {
    contentType: file.type,
    uploadDate: new Date().toJSON()
  }

  yield next

  // Remove temporary file after response
  fs.unlink(file.path, function (err) {
    if (err) log('Couldn\'t remove temporary media file', err)
  })
})

module.exports = router
