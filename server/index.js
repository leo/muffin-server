var mongo = require( 'mongoose' ),
	compression = require( 'compression' ),
	mongo = require( 'mongoose' ),
	express = require( 'express' ),
	bodyParser = require( 'body-parser' ),
	globSync = require( 'glob' ).sync,
	morgan = require( 'morgan' );

module.exports = function( app, options ) {

	if( !mongo.connection.readyState ) {
		mongo.connect( 'mongodb://localhost/muffin' );
	}

	app.use( compression() );

	var db = mongo.connection;

	db.on( 'error', function( err ) {
		console.log( 'Can\'t connect to the DB: ' + err );
		process.exit();
	});

	db.on( 'disconnected', function() {
		console.log( 'Muffin stopped running (DB error)' );
		process.exit();
	});

	process.on( 'SIGINT', function() {

		db.close( function() {
			process.exit();
		});

	});

	app.use( bodyParser.json() );

	app.use( bodyParser.urlencoded({
		extended: false
	}));

	app.get( '/muffin', function( req, res, next ) {

		if( req.path != '/muffin/' ) {
			res.redirect( '/muffin/' );
		} else {
			next();
		}

	});

	var routes = globSync( './routes/*.js', { cwd: __dirname } ).map( require ),
		mocks = globSync( './mocks/**/*.js', { cwd: __dirname } ).map( require );

	app.use( morgan( 'dev' ) );

	routes.forEach( function( route ) {
		route( app );
	});

	mocks.forEach( function( route ) {
		route( app );
	});

}
