const mongoose = require('../lib/db').goose

const gridSchema = mongoose.Schema({}, {
  // Fields that aren't defined in the schema SHOULD be
  // saved to the DB nevertheless
  strict: false
})

module.exports = mongoose.model('Grid', gridSchema, 'media.files')
