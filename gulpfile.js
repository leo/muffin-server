var gulp = require( 'gulp' ),
	sourcemaps = require( 'gulp-sourcemaps' ),
	del = require( 'del' ),
	uglify = require( 'gulp-uglify' ),
	intercept = require( 'gulp-intercept' ),
	babel = require( 'babel-core' ),
	fs = require( 'fs' ),
	compiler = require( 'ember-compiler' );

var paths = {
	scripts: [ 'assets/app.js' ],
	vectors: [ 'assets/vecotrs/*.svg' ],
	templates: [ 'templates/*.hbs' ]
};

gulp.task( 'clean', function( cb ) {
	del( ['build'], cb );
});

var loadTemplates = function() {

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

	return base;

}

var transpile = function( file ) {

	var content = loadTemplates(),
		old = file.contents.toString( 'utf-8' ),
		transpile = babel.transform( content, {
			presets: [ 'es2015' ]
		});

	file.contents = new Buffer( transpile.code + old );
	return file;

}

gulp.task( 'templates', function() {
	return gulp.src( paths.templates )
});

gulp.task( 'app', function() {

	return gulp.src( paths.scripts )
	//.pipe( sourcemaps.init() )
	//.pipe( uglify() )
	//.pipe( sourcemaps.write() )
	.pipe( gulp.dest( 'build' ) );

});

gulp.task( 'default', [ 'app' ] );