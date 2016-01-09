const mongoose = require('../db').goose

const contentSchema = mongoose.Schema({
  lang: String,
  fields: [{
    _id: String,
    content: Object
  }]
})

const pageSchema = mongoose.Schema({
  _id: Number,
  title: String,
  author: String,
  dates: {
    created: Date,
    updated: Date
  },
  content: [contentSchema]
})

pageSchema.virtual('localeDates').get(function () {
  function parseDate (old) {
    const date = new Date(old)
    return date.toLocaleDateString()
  }

  const newDates = {
    created: parseDate(this.dates.created),
    updated: parseDate(this.dates.created)
  }

  return newDates
})

pageSchema.set('toObject', { virtuals: true })

module.exports = mongoose.model('Page', pageSchema)
