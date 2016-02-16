const mongoose = require('../db').goose

/*
const contentSchema = mongoose.Schema({
  lang: String,
  fields: [{
    _id: String,
    content: Object
  }]
})*/

const pageSchema = mongoose.Schema({
  title: String,
  author: String,
  dates: {
    created: Date,
    updated: Date
  },
  content: String,
  slug: {
    type: String,
    lowercase: true
  }
  // content: [contentSchema]
})

pageSchema.virtual('localeDates').get(function () {
  // Convert dates from DB into a readable format
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

// When converting the result of a query to an object,
// the readable dates should be added
pageSchema.set('toObject', { virtuals: true })

module.exports = mongoose.model('Page', pageSchema)
