var gulp = require( 'gulp' ),
	del = require( 'del' ),
	browserSync = require( 'browser-sync' ).create();

var sourcemaps = require( 'gulp-sourcemaps' ),
	uglify = require( 'gulp-uglify' ),
	compiler = require( 'gulp-ember-compiler' ),
	concat = require( 'gulp-concat' ),
	download = require( 'gulp-download' ),
	jquery = require( 'gulp-jquery' ),
	sass = require( 'gulp-sass' ),
	nodemon = require( 'gulp-nodemon' ),
	babel = require( 'gulp-babel' );

var paths = {
	app: [ 'client/source/templates/*.hbs', 'client/source/*.js' ],
	css: [ 'client/styles/*.scss' ],
	vectors: [ 'client/assets/*.svg' ],
	html: [ 'server/*.html' ]
}

gulp.task( 'browser-sync', function() {

	browserSync.init({
		proxy: 'http://localhost:3000/admin',
		files: [ 'build/**/*.*' ],
		port: 4000,
		ui: false,
		notify: false
	});

});

gulp.task( 'clean', function( cb ) {
	del( [ 'build' ], cb );
});

gulp.task( 'vectors', function() {
	return gulp.src( paths.vectors )
	.pipe( gulp.dest( 'build/vectors' ) )
	.pipe( browserSync.stream() );
});

gulp.task( 'css', function() {
	return gulp.src( paths.css )
	.pipe( concat( 'styles.css' ) )
	.pipe( sourcemaps.init() )
	.pipe( sass({ outputStyle: 'compressed' }).on( 'error', sass.logError ) )
	.pipe( sourcemaps.write() )
	.pipe( gulp.dest( 'build' ) )
	.pipe( browserSync.stream() );
});

gulp.task( 'vendor', function() {
	return jquery.src()
	.pipe( download( 'http://builds.emberjs.com/release/ember.debug.js' ) )
	.pipe( concat( 'vendor.js' ) )
	.pipe( sourcemaps.init() )
	.pipe( uglify() )
	.pipe( sourcemaps.write( '/' ) )
	.pipe( gulp.dest( 'build' ) );
});

gulp.task( 'app', function() {

	var babelConfig = {
		presets: [ 'es2015' ]
	}

	return gulp.src( paths.app )
	.pipe( compiler() )
	.pipe( concat( 'app.js' ) )
	.pipe( sourcemaps.init() )
	.pipe( babel( babelConfig ) )
	.pipe( uglify() )
	.pipe( sourcemaps.write( '/' ) )
	.pipe( gulp.dest( 'build' ) )
	.pipe( browserSync.stream() );

});

gulp.task( 'default', [ 'clean', 'vectors', 'css', 'vendor', 'app' ] );

gulp.task( 'watch-core', [ 'browser-sync' ], function() {

	var config = {
		script: './server',
		ignore: [
			'client/',
			'build/'
		],
		ext: 'js'
	}

	nodemon( config );

	var toWatch = [
		'app',
		'css',
		'vectors'
	];

	for( ID in toWatch ) {
		var type = toWatch[ID];
		gulp.watch( paths[type], [ type ] );
	}

	gulp.watch( paths.html ).on( 'change', browserSync.reload );

});