const mongoose = require('mongoose'),
      gridFS = require('mongoose-fs');

const fileSchema = mongoose.Schema({
  title: String,
  url: String
});

fileSchema.plugin(gridFS, { keys: ['content', 'complement'], mongoose: mongoose });

module.exports = mongoose.model('File', fileSchema);
