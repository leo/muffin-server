const mongoose = require('../db').goose;

const pageSchema = mongoose.Schema({
  _id: Number,
  title: String,
  author: String,
  dates: {
    created: Date,
    updated: Date
  }
});

pageSchema.virtual('localeDates').get(function() {

  function parseDate(old) {
    const date = new Date(old);
    return date.toLocaleDateString();
  }

  const newDates = {
    created: parseDate(this.dates.created),
    updated: parseDate(this.dates.created)
  }

  return newDates;
});

pageSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Page', pageSchema);
