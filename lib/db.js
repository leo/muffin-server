const mongoose = require('mongoose');
mongoose.connect('localhost', 'muffin');

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Connection error:'));

exports.User = mongoose.model('User', {
  _id: String,
  password: Number
});

exports.Page = mongoose.model('Page', {
  _id: Number,
  title: String,
  author: String,
  dates: {
    created: Date,
    updated: Date
  }
});

exports.connection = db;
