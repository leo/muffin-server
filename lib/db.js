const mongoose = require('mongoose');

mongoose.connect('localhost', 'muffin');

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Connection error:'));

module.exports = db;
