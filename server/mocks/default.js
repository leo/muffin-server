/*jshint node:true*/
module.exports = function(app) {
  var express = require('express');
  var defaultRouter = express.Router();

  defaultRouter.get('/', function(req, res) {
    res.send({
      'default': []
    });
  });

  defaultRouter.post('/', function(req, res) {
    res.status(201).end();
  });

  defaultRouter.get('/:id', function(req, res) {
    res.send({
      'default': {
        id: req.params.id
      }
    });
  });

  defaultRouter.put('/:id', function(req, res) {
    res.send({
      'default': {
        id: req.params.id
      }
    });
  });

  defaultRouter.delete('/:id', function(req, res) {
    res.status(204).end();
  });

  // The POST and PUT call will not contain a request body
  // because the body-parser is not included by default.
  // To use req.body, run:

  //    npm install --save-dev body-parser

  // After installing, you need to `use` the body-parser for
  // this mock uncommenting the following line:
  //
  //app.use('/api/default', require('body-parser'));
  app.use('/api/default', defaultRouter);
};
