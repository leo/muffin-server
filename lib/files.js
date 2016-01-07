const db = require('./db')
const mongoose = db.goose
const conn = db.rope

const combinedStream = require('combined-stream').create()
const fs = require('fs')
const grid = require('gridfs-stream')
const fileType = require('file-type')

grid.mongo = mongoose.mongo

conn.once('open', function () {
  console.log('Conn open!')

  const gfs = grid(conn.db)
  const file = __dirname + '/../public/vectors/sample.png'

  fs.readFile(file, function (err, data) {
    if (err) {
      throw err
    }

    const stats = fs.statSync(file)
    const buffer = new Buffer(stats.size)
    const fd = fs.openSync(file, 'r')

    fs.read(fd, buffer, 0, buffer.length, null, function (err, bytesRead, buffer) {
      if (err) {
        throw err
      }

      fs.close(fd)

      const writestream = gfs.createWriteStream({
        filename: 'sample.png',
        root: 'media',
        content_type: fileType(buffer).mime,
        metadata: {
          caption: 'What the hell?'
        }
      })

      combinedStream.append(buffer)
      combinedStream.pipe(writestream)

      writestream.on('close', function (file) {
        console.log(file.filename + ' Written to DB')
      })
    })
  })

  /*
  gfs.remove({
    _id: '568a8b5d3b4d31cefa55aacb',
    root: 'media'
  }, function(err) {
    if (err) {
      throw err
    }
    console.log('Deleted!')
  })
  */
})
