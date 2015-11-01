var gulp = require( 'gulp' ),
	sourcemaps = require( 'gulp-sourcemaps' ),
	del = require( 'del' ),
	uglify = require( 'gulp-uglify' ),
	compiler = require( 'gulp-ember-compiler' ),
	concat = require( 'gulp-concat' ),
	download = require( 'gulp-download' ),
	jquery = require( 'gulp-jquery' );

var paths = {
	vectors: [ 'assets/vectors/*.svg' ],
	app: [ 'templates/*.hbs', 'assets/app.js' ]
};

gulp.task( 'clean', function( cb ) {
	del( ['build'], cb );
});

gulp.task( 'vendor', function() {

	return jquery.src()
	.pipe( download( 'http://builds.emberjs.com/release/ember.prod.js' ) )
	.pipe( concat( 'vendor.js' ) )
	.pipe( sourcemaps.init() )
	.pipe( uglify() )
	.pipe( sourcemaps.write( '/' ) )
	.pipe( gulp.dest( 'build' ) );

});

gulp.task( 'app', function() {

	return gulp.src( paths.app )
	.pipe( compiler() )
	.pipe( concat( 'app.js' ) )
	.pipe( sourcemaps.init() )
	.pipe( uglify() )
	.pipe( sourcemaps.write( '/' ) )
	.pipe( gulp.dest( 'build' ) );

});

gulp.task( 'default', [ 'clean', 'vendor', 'app' ] );