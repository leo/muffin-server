const db = require('./db'),
      mongoose = db.goose,
      conn = db.rope;

const fs = require('fs'),
      grid = require('gridfs-stream');

grid.mongo = mongoose.mongo;

conn.once('open', function() {

  console.log('Conn open!');
  const gfs = grid(conn.db);

  /*
  const writestream = gfs.createWriteStream({
    filename: 'sample.png',
    root: 'media'
  });

  fs.createReadStream(__dirname + '/sample.png').pipe(writestream);

  writestream.on('close', function(file) {
    console.log(file.filename + ' Written to DB');
  });
  */

});
