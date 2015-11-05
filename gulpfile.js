var gulp = require( 'gulp' ),
	sourcemaps = require( 'gulp-sourcemaps' ),
	del = require( 'del' ),
	uglify = require( 'gulp-uglify' ),
	compiler = require( 'gulp-ember-compiler' ),
	concat = require( 'gulp-concat' ),
	download = require( 'gulp-download' ),
	jquery = require( 'gulp-jquery' ),
	sass = require( 'gulp-sass' ),
	nodemon = require( 'gulp-nodemon' );

var paths = {
	app: [ 'templates/*.hbs', 'client/*.js' ],
	css: [ 'client/*.scss' ],
	vectors: [ 'client/vectors/*.svg' ],
	html: [ 'client/*.html' ]
}

gulp.task( 'clean', function( cb ) {
	del( [ 'build' ], cb );
});

gulp.task( 'vectors', function() {
	return gulp.src( paths.vectors )
	.pipe( gulp.dest( 'build/assets/vectors' ) );
});

gulp.task( 'css', function() {
	return gulp.src( paths.css )
	.pipe( concat( 'styles.css' ) )
	.pipe( sourcemaps.init() )
	.pipe( sass({ outputStyle: 'compressed' }).on( 'error', sass.logError ) )
	.pipe( sourcemaps.write() )
	.pipe( gulp.dest( 'build/assets' ) );
});

gulp.task( 'vendor', function() {
	return jquery.src()
	.pipe( download( 'http://builds.emberjs.com/release/ember.prod.js' ) )
	.pipe( concat( 'vendor.js' ) )
	.pipe( sourcemaps.init() )
	.pipe( uglify() )
	.pipe( sourcemaps.write( '/' ) )
	.pipe( gulp.dest( 'build/assets' ) );
});

gulp.task( 'app', function() {
	return gulp.src( paths.app )
	.pipe( compiler() )
	.pipe( concat( 'app.js' ) )
	.pipe( sourcemaps.init() )
	.pipe( uglify() )
	.pipe( sourcemaps.write( '/' ) )
	.pipe( gulp.dest( 'build/assets' ) );
});

gulp.task( 'html', function() {
	gulp.src( paths.html )
	.pipe( gulp.dest( 'build' ) );
});

gulp.task( 'default', [ 'clean', 'html', 'vectors', 'css', 'vendor', 'app' ] );

gulp.task( 'watch-core', function() {

	var config = {
		script: 'run.js',
		ignore: [
			'client/',
			'templates/',
			'build/'
		],
		ext: 'js'
	}

	nodemon( config );

	var toWatch = [
		'html',
		'app',
		'css',
		'vectors'
	];

	for( ID in toWatch ) {
		var type = toWatch[ID];
		gulp.watch( paths[type], [ type ] );
	}

});