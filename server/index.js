var mongo = require( 'mongoose' ),
	compression = require( 'compression' ),
	mongo = require( 'mongoose' ),
	models = require( './models' ),
	express = require( 'express' ),
	app = express(),
	fs = require( 'fs' ),
	bodyParser = require( 'body-parser' ),
	globSync = require( 'glob' ).sync;

module.exports = function( app, options ) {

	var User = models( 'user' );

	mongo.createConnection( 'mongodb://localhost/muffin' );
	app.use( compression() );

	var db = mongo.connection;

	db.on( 'error', function( err ) {
		console.log( 'Can\'t connect to the DB: ' + err );
		process.exit();
	});

	db.on( 'disconnected', function() {
		console.log( 'Muffin stopped running (DB error)' );
	});

	process.on( 'SIGINT', function() {

		db.close( function() {
			process.exit();
		});

	});

	var toUse = {
		parser: require( 'cookie-parser' ),
		session: require( 'cookie-session' )
	}

	for( var module in toUse ) {

		var item = toUse[module],
			session = {
				secret: 'w,]8vVjgibJn+)v7d4zE9P>LXVQ6b',
				name: 'muff_sess',
				httpOnly: false
			};

		app.use( item( module == 'session' && session ) );

	}

	app.use( bodyParser.json() );

	app.use( bodyParser.urlencoded({
		extended: false
	}));

	app.post( '/muffin/token', function( req, res ) {

		function denyAccess() {

			res.status( 400 ).json({
				error: 'invalid_grant'
			});

		}

		var query = User.findOne({
			'_id': req.body.username
		});

		query.select( 'password' );

		query.exec( function( err, user ) {

			if( req.body.grant_type === 'password' ) {

				if( !user ) {
					denyAccess();
				} else if( user.password == req.body.password ) {

					res.status( 200 ).json({
						access_token: 'secret token!'
					});

				} else {
					denyAccess();
				}

			} else {

				res.status( 400 ).json({
					error: 'unsupported_grant_type'
				});

			}

		});

	});

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

}
