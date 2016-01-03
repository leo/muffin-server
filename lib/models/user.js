const mongoose = require('mongoose');

module.exports = mongoose.model('User', {
  _id: String,
  password: Number
});
