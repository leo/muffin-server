/*jshint node:true*/
module.exports = function(app) {
  var express = require('express');
  var filesRouter = express.Router();

  filesRouter.get('/', function(req, res) {

  			var list = [];

		for( var i = 0; i < 42; ++i ) {

			list.push({
				_id: i,
				url: 'assets/sample.png'
			});

		}


	    res.send({
	      'file': list
	    });

  });

  filesRouter.post('/', function(req, res) {
    res.status(201).end();
  });

  filesRouter.get('/:id', function(req, res) {
    res.send({
      'files': {
        id: req.params.id
      }
    });
  });

  filesRouter.put('/:id', function(req, res) {
    res.send({
      'files': {
        id: req.params.id
      }
    });
  });

  filesRouter.delete('/:id', function(req, res) {
    res.status(204).end();
  });

  // The POST and PUT call will not contain a request body
  // because the body-parser is not included by default.
  // To use req.body, run:

  //    npm install --save-dev body-parser

  // After installing, you need to `use` the body-parser for
  // this mock uncommenting the following line:
  //
  //app.use('/api/files', require('body-parser'));
  app.use('/api/files', filesRouter);
};
