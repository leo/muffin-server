var compiler = require( 'ember-compiler' ),
	fs = require( 'fs' );
 
var base = '',
	templates = fs.readdirSync( 'templates' );

for( id in templates ) {

	var file = templates[id],
		input = fs.readFileSync( 'templates/' + file, { encoding: 'utf8' } ),
		template = compiler.precompile( input, false );

	base += 'export default Ember.HTMLBars.template(' + template + ');';

}

fs.writeFile( 'all.js', base, function( err ) {

	if( err ) {
		return console.log( err );
	}

	console.log( 'Saved' );

});