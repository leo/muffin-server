const mongoose = require('../db').goose

const gridSchema = mongoose.Schema({}, {
  strict: false
})

module.exports = mongoose.model('Grid', gridSchema, 'media.files')
