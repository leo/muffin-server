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

	options.httpServer.on( 'listening', function() {

		require( 'colors' );

		var current = process.cwd(),
			dir = current.substring( current.lastIndexOf( '/' ) + 1, current.length );

		var host = this.address().address == '::' && 'localhost',
			port = this.address().port + '/muffin';

		var address = 'http://' + host + ':' + port;
		process.stdout.write( '\u001b[2J\u001b[0;0H' );

		var messages = [
			'MUFFIN IS RUNNING!'.green + '\n',
			'You can access your site at ' + address.underline.red + '\n',
			'Use ' + 'cmd'.bgWhite + ' + ' + 'double-click'.bgWhite + ' on the link to open it.' + '\n\n'
		];

		for( var i = 0; i < messages.length; i++ ) {
			console.log( messages[i] );
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
