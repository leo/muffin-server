const mongoose = require('mongoose');

mongoose.connect('localhost', 'muffin');
const db = mongoose.connection;

db.on('error', function(message) {
  console.error('Couldn\'t connect to DB: ' + message );
  process.kill(0);
});

module.exports = db;
