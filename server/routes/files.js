var express = require( 'express' ),
	filesRouter = express.Router();

module.exports = function( app ) {

	filesRouter.get( '/', function( req, res ) {

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

	filesRouter.post( '/', function( req, res ) {
		res.status( 201 ).end();
	});

	filesRouter.get( '/:id', function( req, res ) {

		res.send({
			'files': {
				id: req.params.id
			}
		});

	});

	filesRouter.put( '/:id', function( req, res ) {

		res.send({
			'files': {
				id: req.params.id
			}
		});

	});

	filesRouter.delete( '/:id', function( req, res ) {
		res.status( 204 ).end();
	});

	app.use( '/api/files', filesRouter );

}
