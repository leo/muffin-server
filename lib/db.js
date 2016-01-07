const mongoose = require('mongoose')
const grid = require('gridfs-stream')

mongoose.connect('localhost', 'muffin')
const connection = mongoose.connection

connection.on('error', function (message) {
  console.error("Couldn't connect to DB: " + message)
  process.kill(0)
})

exports.rope = connection
exports.goose = mongoose

grid.mongo = mongoose.mongo
exports.fs = grid(connection.db)
