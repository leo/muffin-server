import mongoose from 'mongoose'
import grid from 'gridfs-stream'
import { log } from './'

const dbHost = process.env.DB_HOST || 'localhost'
const dbName = process.env.DB_NAME || 'muffin'

// Connect to DB using the credentials set in the ".env" file
mongoose.connect('mongodb://' + dbHost + '/' + dbName, {
  user: process.env.DB_USER,
  pass: process.env.DB_PASSWORD
})

mongoose.Promise = require('es6-promise').Promise;

const connection = mongoose.connection

connection.on('error', function (info) {
  if (info.message.includes('ECONNREFUSED')) {
    info.message = 'Please make sure it\'s running and accessible!'
  }

  log('Couldn\'t connect to DB: ' + info.message)
  process.exit(1)
})

process.on('SIGINT', () => connection.close(() => {
  process.exit(0)
}))

export { connection as rope }
export { mongoose as goose }

// Tell gridfs where to find the files
grid.mongo = mongoose.mongo
const gridConnection = grid(connection.db)

export { gridConnection as fs }
