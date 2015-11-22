var express = require( 'express' ),
	pagesRouter = express.Router(),
	models = require( '../models' );

var Page = models( 'page' );

module.exports = function( app ) {

	pagesRouter.get( '/', function( req, res ) {

		Page.find( {}, 'title author', function( err, results ) {
			res.send({
				pages: results
			})
		});

	});

	pagesRouter.post( '/', function( req, res ) {
		res.status( 201 ).end();
	});

	pagesRouter.get( '/:id', function( req, res ) {

		var which = {
			_id: req.params.id
		}

		Page.findOne( which, 'title author', function( err, result ) {
			res.send({
				'pages': result
			});
		});

	});

	pagesRouter.put( '/:id', function( req, res ) {

		res.send({
			'pages': {
				id: req.params.id
			}
		});

	});

	pagesRouter.delete( '/:id', function( req, res ) {
		res.status( 204 ).end();
	});

	app.use( '/api/pages', pagesRouter );

}
