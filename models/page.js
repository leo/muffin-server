import { goose } from '../db'

/*
const contentSchema = goose.Schema({
  lang: String,
  fields: [{
    _id: String,
    content: Object
  }]
})*/

const pageSchema = goose.Schema({
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

pageSchema.set('toObject', { virtuals: true })

const model = goose.model('Page', pageSchema)
export default model
