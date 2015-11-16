var mongo = require( 'mongoose' ),
	schemas = require( './schemas' ),
	handleBars = require( 'handlebars' ),
	express = require( 'express' ),
	app = express(),
	fs = require( 'fs' ),
	bodyParser = require( 'body-parser' ),
	compression = require( 'compression' );

mongo.connect( 'mongodb://localhost/muffin' );
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

for( item in schemas ) {

	var fields = schemas[item],
		schema = mongo.Schema( fields, {
			versionKey: false
		});

	var virtualID = schema.virtual( 'id' );

	virtualID.get( function() {
		return this._id;
	});

	virtualID.set( function( value ) {
		this._id = value;
	});

	global[item] = mongo.model( item, schema );

}

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

handleBars.registerHelper( 'assetPath', function( file ) {

	var extension = file.split( '.' )[1],
		folder = extension == 'svg' ? 'vectors' : extension;

	return '/admin/assets/' + folder + '/' + file;

});

handleBars.registerHelper( '_', function( text ) {
	return text;
});

app.get( '/admin/logout', function( req, res ) {

	if( req.session.userName ) {
		req.session = null;
	}

	res.redirect( '/admin' );

});

app.listen( process.env.PORT || 3000, function() {

	require( 'colors' );

	var current = process.cwd(),
		dir = current.substring( current.lastIndexOf( '/' ) + 1, current.length );

	var host = this.address().address == '::' && 'localhost',
		port = this.address().port + '/admin';

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

app.use( bodyParser.json() );

app.use( bodyParser.urlencoded({
  extended: false
}) );

app.post( '/admin/token', function( req, res ) {

	if( req.body.grant_type === 'password' ) {

		if( req.body.username === 'letme' && req.body.password === 'in' ) {
			res.status( 200 ).send( '{ "access_token": "secret token!" }' );
		} else {
			res.status( 400 ).send( '{ "error": "invalid_grant" }' );
		}

	} else {
		res.status( 400 ).send( '{ "error": "unsupported_grant_type" }' );
	}


	/*
	var query = User.findOne({
		'_id': req.body.username
	});

	query.select( 'password' );

	query.exec( function( err, user ) {

		if( !user ) {
			res.send( '0' );
		} else if( user.password == req.body.password ) {

			req.session.userName = req.body.username;
			res.send( '1' );

		} else {
			res.send( '0' );
		}

	});*/

});

function loadView( view, err, content ) {

	if( err ) {
		console.log( err );
		return;
	}

	var look = fs.readFileSync( 'templates/' + view + '.hbs', 'utf8' ),
		template = handleBars.compile( look );

	if( view !== 'edit' ) {

		var other = {
			items: content
		}

	}

	var tags = {

		pageTitle: function() {

			switch( view ) {
				case 'dashboard':
					return 'Dashboard';

				case 'edit':
					return content.title;

				case 'list':
					return 'Pages';

				default:
					return 'Error 404';
			}

		},

		content: template( view == 'edit' ? content : other ),
		view: view

	}

	var base = fs.readFileSync( 'views/admin.hbs', 'utf8' ),
		container = handleBars.compile( base );

	return container( tags );

}

app.get( '/admin/edit/:id', function( req, res ) {

	var which = {
		_id: req.params.id
	}

	Page.findOne( which, 'title author', function( err, result ) {
		res.send( loadView( 'edit', err, result ) );
	});

});

app.get( '/admin/list', function( req, res ) {

	Page.find( {}, 'title author', function( err, results ) {
		res.send( loadView( 'list', err, results ) );
	});

});
