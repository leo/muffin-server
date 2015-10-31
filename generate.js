var compiler = require( 'ember-compiler' ),
	fs = require( 'fs' ),
	babel = require( 'babel-core' );
 
var base = '',
	templates = fs.readdirSync( 'templates' );

var template = compiler.precompile( '{{outlet}}', false );
base += 'Ember.TEMPLATES["application"] = Ember.HTMLBars.template(' + template + ');';

for( id in templates ) {

	var file = templates[id],
		input = fs.readFileSync( 'templates/' + file, { encoding: 'utf8' } ),
		template = compiler.precompile( input, false );

	base += 'Ember.TEMPLATES["' + file.split( '.' )[0] + '"] = Ember.HTMLBars.template(' + template + ');';

}

var transpile = babel.transform( base, {
	presets: [ 'es2015' ]
});

fs.writeFile( 'dist/base.js', transpile.code, function( err ) {

	if( err ) {
		return console.log( err );
	}

	console.log( 'Saved' );

});