const express = require('express'),
      router = express.Router(),
      fs = require('fs'),
      path = require('path'),
      grid = require('gridfs-stream');

const db = require('../lib/db'),
      mongoose = db.goose,
      conn = db.rope;

grid.mongo = mongoose.mongo;

router.get('/', function(req, res) {

  const name = path.basename(req.originalUrl),
        gfs = grid(conn.db);

  const query = {
    filename: name,
    root: 'media'
  }

  function sendFile() {

    const stream = gfs.createReadStream(query);

    gfs.findOne(query, function(err, meta) {

      if (err) {
        throw err;
      }

      res.writeHead(200, {
          'Content-Type': meta.contentType,
          'Content-Length': meta.length
      });

      stream.pipe(res);
    });

  }

  gfs.exist(query, function(err, found) {
    if (err) {
      throw err;
    }
    found ? sendFile() : res.send('File doesn\'t exist!');
  });

});

module.exports = router;
