const mongoose = require('mongoose');

mongoose.connect('localhost', 'muffin');
const connection = mongoose.connection;

connection.on('error', function(message) {
  console.error('Couldn\'t connect to DB: ' + message );
  process.kill(0);
});

exports.rope = connection;
exports.goose = mongoose;
