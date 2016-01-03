const mongoose = require('mongoose');
mongoose.connect('localhost', 'muffin');

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Connection error:'));

exports.User = mongoose.model('User', {
  _id: String,
  password: Number
});

exports.File = mongoose.model('File', {
  title: String,
  url: String
});

var pageSchema = mongoose.Schema({
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

exports.Page = mongoose.model('Page', pageSchema);
exports.connection = db;
