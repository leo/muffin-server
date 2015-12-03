var express = require( 'express' ),
	http = require( 'http' ),
	app = express(),
	server = require( './server' );

app.use( '/muffin', express.static( 'dist' ) );
app.server = http.createServer( app );

app.server.listen( 3000, function() {
	server( app, app.server );
});

app.server.on( 'listening', function() {

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
