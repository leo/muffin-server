const mongoose = require('../lib/db').goose

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

// When converting the result of a query to an object,
// the readable dates should be added
pageSchema.set('toObject', { virtuals: true })

module.exports = mongoose.model('Page', pageSchema)
