const mongoose = require('mongoose')
const grid = require('gridfs-stream')

const dbHost = process.env.DB_HOST || 'localhost'
const dbName = process.env.DB_NAME || 'muffin'

// Connect to DB using the credentials set in the ".env" file
mongoose.connect('mongodb://' + dbHost + '/' + dbName, {
  user: process.env.DB_USER,
  pass: process.env.DB_PASSWORD
})

const connection = mongoose.connection

connection.on('error', function (message) {
  console.error('Couldn\'t connect to DB: ' + message)
  process.kill(0)
})

exports.rope = connection
exports.goose = mongoose

// Tell gridfs where to find the files
grid.mongo = mongoose.mongo
exports.fs = grid(connection.db)
