const router = require('koa-router')()
const jwt = require('koa-jwt')
const fs = require('fs')
const path = require('path')

const log = require('../lib/log')
const Page = require('../models/page')
const User = require('../models/user')

const load = require('../lib/get')
const gfs = require('../lib/db').fs

router.post('/token-auth', function *(next) {
  const body = this.request.body

  if (!body.username || !body.password) {
    this.status = 400
    this.body = {
      error: 'User and/or password empty'
    }
    return
  }

  const query = User.where({ _id: body.username })

  try {
    var user = yield query.findOne()
  } catch (err) {
    log('Couldn\'t load user', err)
  }

  if (!user) {
    this.status = 400
    this.body = {
      error: 'User doesn\'t exist'
    }
    return
  }

  // Compare password with the one within the DB
  const isMatch = user.tryPassword(body.password)

  if (isMatch) {
    const token = jwt.sign(body, process.env.SESSION_SECRET, {
      expiresIn: 300
    })

    this.body = {
      token
    }

    return
  }

  this.status = 400

  this.body = {
    error: 'Wrong password'
  }

  yield next
})

router.post('/token-refresh', function *(next) {
  const token = this.request.body.token

  try {
    const decoded = jwt.verify(token, process.env.SESSION_SECRET)
  } catch (err) {
    this.status = 401
    this.body = { error: err }

    return
  }

  const query = User.where({ _id: decoded.username })

  try {
    var user = yield query.findOne()
  } catch (err) {
    log('Couldn\'t load user', err)
  }

  if (!user) {
    this.status = 401
    this.body = {
      error: 'User doesn\'t exist'
    }

    return
  }

  const isMatch = user.tryPassword(decoded.password)

  if (isMatch) {
    this.body = {
      token: jwt.sign(decoded, process.env.SESSION_SECRET, {
        expiresIn: 300
      })
    }

    return
  }

  this.status = 401

  this.body = {
    error: 'Wrong password'
  }

  yield next
})

function detSeparator (handle) {
  var numbers = {}

  const types = {
    spaces: ' ',
    dots: '.',
    underscores: '_',
    dashes: '-'
  }

  for (var type in types) {
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

router.post('/upload', function *(next) {
  const file = this.request.body.files.file
  const ext = path.extname(file.name)
  const name = path.basename(file.name, ext)

  // Determine the most used separator in the filename
  const separator = detSeparator(name)

  var id = 0

  // Encode filename as URI string
  function formatName (n) {
    return encodeURIComponent(name + (n > 0 ? separator + n : '') + ext)
  }

  do {
    // Check if filename is already in DB
    try {
      var isAvailable = yield gfs.exist({
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

function singular (type) {
  return type.substring(0, type.length - 1)
}

router.get('/:type', function *(next) {
  const type = this.params.type

  this.body = {
    data: yield load.all(singular(type))
  }

  yield next
})

router.get('/(.*)/:id', function *(next) {
  const type = this.req.url.split('/')[2]

  this.body = {
    data: yield load.one(singular(type), this.params.id)
  }

  yield next
})

module.exports = router
